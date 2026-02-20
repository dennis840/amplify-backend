const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas públicas (sin autenticación)
router.post('/register', authController.register);
router.post('/signin', authController.signin);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Rutas protegidas (requieren token JWT)
router.get('/me', authMiddleware.verifyToken, authController.getMe);

module.exports = router;