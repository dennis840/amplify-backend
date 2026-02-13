const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const jwtUtils = require('../utils/jwtUtils');

const authController = {
  // Registro de usuario
  async register(req, res) {
    try {
      const { name, email, password, terms } = req.body;

      // Validar campos obligatorios
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Todos los campos son obligatorios'
        });
      }

      // Validar que aceptó términos
      if (!terms) {
        return res.status(400).json({
          success: false,
          error: 'Debes aceptar los términos y condiciones'
        });
      }

      // Verificar si el email ya existe
      const existingUser = await userModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'El email ya está registrado'
        });
      }

      // Hash de la contraseña
      const passwordHash = await bcrypt.hash(password, 10);

      // Crear usuario
      const newUser = await userModel.create(name, email, passwordHash);

      // Generar token JWT
      const token = jwtUtils.generateToken(newUser.id, newUser.email);

      // Respuesta exitosa
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
  }
};

module.exports = authController;