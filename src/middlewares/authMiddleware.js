const jwtUtils = require('../utils/jwtUtils');
const userModel = require('../models/userModel');

const authMiddleware = {
  // Verificar token JWT
  async verifyToken(req, res, next) {
    try {
      // Obtener token del header Authorization
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          error: 'Token no proporcionado'
        });
      }

      // Extraer el token (formato: "Bearer TOKEN")
      const token = authHeader.split(' ')[1];

      // Verificar token
      const verification = jwtUtils.verifyToken(token);

      if (!verification.valid) {
        return res.status(401).json({
          success: false,
          error: 'Token inválido o expirado'
        });
      }

      // Buscar usuario en base de datos
      const user = await userModel.findById(verification.decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }

      // Adjuntar usuario a la request para usarlo en rutas
      req.user = {
        id: user.id,
        email: user.email,
        name: user.name
      };

      next(); // Continuar a la siguiente función

    } catch (error) {
      console.error('Error en authMiddleware:', error);
      res.status(500).json({
        success: false,
        error: 'Error al verificar token'
      });
    }
  }
};

module.exports = authMiddleware;