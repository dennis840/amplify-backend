const jwt = require('jsonwebtoken');

const jwtUtils = {
  // Generar token JWT
  generateToken(userId, email) {
    const payload = {
      id: userId,
      email: email
    };
    
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    
    return token;
  },

  // Verificar token JWT
  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return { valid: true, decoded };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }
};

module.exports = jwtUtils;