const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const jwtUtils = require('../utils/jwtUtils');

const authController = {
  // Registro de usuario
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

  // Inicio de sesión
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

  // Obtener usuario actual
  async getMe(req, res) {
    try {
      res.json({
        success: true,
        user: {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email
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

  // Solicitar reset de contraseña
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

      if (user) {
        const crypto = require('crypto');
        const resetToken = crypto.randomBytes(32).toString('hex');
        
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        const passwordResetModel = require('../models/passwordResetModel');
        await passwordResetModel.createResetToken(user.id, resetToken, expiresAt);

        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        const { sendPasswordResetEmail } = require('../config/emailConfig');
        await sendPasswordResetEmail(user.email, resetLink, user.name);
      }

      res.json({
        success: true,
        message: 'Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña'
      });

    } catch (error) {
      console.error('Error en forgotPassword:', error);
      res.status(500).json({
        success: false,
        error: 'Error al procesar solicitud'
      });
    }
  },

  // Restablecer contraseña con token
  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({
          success: false,
          error: 'Token y nueva contraseña son requeridos'
        });
      }

      const passwordResetModel = require('../models/passwordResetModel');
      const resetData = await passwordResetModel.findValidToken(token);

      if (!resetData) {
        return res.status(400).json({
          success: false,
          error: 'Token inválido o expirado'
        });
      }

      const passwordHash = await bcrypt.hash(newPassword, 10);

      const updateQuery = `
        UPDATE users 
        SET password_hash = $1 
        WHERE id = $2
      `;
      const db = require('../config/database');
      await db.query(updateQuery, [passwordHash, resetData.user_id]);

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