const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const jwtUtils = require('../utils/jwtUtils');
const db = require('../config/database');

const authController = {
  async register(req, res) {
    try {
      const { name, email, password, terms } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Todos los campos son obligatorios'
        });
      }

      if (!terms) {
        return res.status(400).json({
          success: false,
          error: 'Debes aceptar los términos y condiciones'
        });
      }

      const existingUser = await userModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'El email ya está registrado'
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = await userModel.create(name, email, passwordHash);
      const token = jwtUtils.generateToken(newUser.id, newUser.email);

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email
        },
        token
      });

    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({
        success: false,
        error: 'Error al registrar usuario'
      });
    }
  },

  async signin(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email y contraseña son obligatorios'
        });
      }

      const user = await userModel.findByEmail(email);

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Email no registrado'
        });
      }

      const passwordMatch = await bcrypt.compare(password, user.password_hash);

      if (!passwordMatch) {
        return res.status(401).json({
          success: false,
          error: 'Contraseña incorrecta'
        });
      }

      const token = jwtUtils.generateToken(user.id, user.email);

      res.json({
        success: true,
        message: 'Inicio de sesión exitoso',
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        token
      });

    } catch (error) {
      console.error('Error en signin:', error);
      res.status(500).json({
        success: false,
        error: 'Error al iniciar sesión'
      });
    }
  },

  async getMe(req, res) {
    try {
      const userId = req.user.id;

      const result = await db.query(
        `
        SELECT 
          u.id,
          u.name,
          u.email,
          u.created_at,
          mp.artistic_name,
          mp.profile_image
        FROM users u
        LEFT JOIN musician_profiles mp ON mp.user_id = u.id
        WHERE u.id = $1
        `,
        [userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }

      const user = result.rows[0];

      res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          created_at: user.created_at
        },
        profile: {
          artistic_name: user.artistic_name,
          profile_image: user.profile_image
        }
      });

    } catch (error) {
      console.error('Error en getMe:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener usuario'
      });
    }
  },

  // 🔥 CORREGIDO Y SEGURO
 async changePassword(req, res) {
  try {
    console.log("=== CHANGE PASSWORD ===");
    console.log("req.user:", req.user);
    console.log("req.body:", req.body);

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no autenticado'
      });
    }

    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Ambas contraseñas son requeridas'
      });
    }

    // Obtener password actual desde la BD
    const result = await db.query(
      'SELECT password_hash FROM users WHERE id = $1',
      [userId]
    );

    console.log("DB result:", result.rows);

    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    const user = result.rows[0];

    // Comparar contraseña actual
    const passwordMatch = await bcrypt.compare(
      currentPassword,
      user.password_hash
    );

    console.log("Password match:", passwordMatch);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        error: 'La contraseña actual es incorrecta'
      });
    }

    // Hashear nueva contraseña
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    await db.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [newPasswordHash, userId]
    );

    console.log("Password updated successfully");

    return res.json({
      success: true,
      message: 'Contraseña actualizada correctamente'
    });

  } catch (error) {
    console.error('🔥 ERROR REAL en changePassword:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno al cambiar contraseña'
    });
  }
},

  async logout(req, res) {
    try {
      res.json({
        success: true,
        message: 'Sesión cerrada'
      });
    } catch (error) {
      console.error('Error en logout:', error);
      res.status(500).json({
        success: false,
        error: 'Error al cerrar sesión'
      });
    }
  },

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          error: 'Email es requerido'
        });
      }

      const user = await userModel.findByEmail(email);

      if (!user) {
        return res.status(400).json({
          success: false,
          error: 'El correo no está registrado'
        });
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      const passwordResetModel = require('../models/passwordResetModel');
      await passwordResetModel.createResetToken(user.id, code, expiresAt);

      const { sendPasswordResetEmail } = require('../config/emailConfig');
      await sendPasswordResetEmail(user.email, code, user.name);

      res.json({
        success: true,
        message: 'Código enviado a tu correo electrónico'
      });

    } catch (error) {
      console.error('Error en forgotPassword:', error);
      res.status(500).json({
        success: false,
        error: 'Error al procesar solicitud'
      });
    }
  },

  async verifyResetToken(req, res) {
    try {
      const { token } = req.query;

      if (!token) {
        return res.status(400).json({
          success: false,
          error: 'Código es requerido'
        });
      }

      const passwordResetModel = require('../models/passwordResetModel');
      const resetData = await passwordResetModel.findValidToken(token);

      if (!resetData) {
        return res.status(400).json({
          success: false,
          error: 'El código es inválido o ha expirado'
        });
      }

      res.json({
        success: true,
        message: 'Código válido'
      });

    } catch (error) {
      console.error('Error en verifyResetToken:', error);
      res.status(500).json({
        success: false,
        error: 'Error al verificar código'
      });
    }
  },

  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({
          success: false,
          error: 'Código y nueva contraseña son requeridos'
        });
      }

      const passwordResetModel = require('../models/passwordResetModel');
      const resetData = await passwordResetModel.findValidToken(token);

      if (!resetData) {
        return res.status(400).json({
          success: false,
          error: 'Código inválido o expirado'
        });
      }

      const passwordHash = await bcrypt.hash(newPassword, 10);

      await db.query(
        'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
        [passwordHash, resetData.user_id]
      );

      await passwordResetModel.markTokenAsUsed(token);

      res.json({
        success: true,
        message: 'Contraseña actualizada exitosamente'
      });

    } catch (error) {
      console.error('Error en resetPassword:', error);
      res.status(500).json({
        success: false,
        error: 'Error al restablecer contraseña'
      });
    }
  }
};

module.exports = authController;