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
  }
};

module.exports = authController;