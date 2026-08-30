const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas públicas
router.post('/register', authController.register);
router.post('/signin', authController.signin);
router.post('/login', authController.signin); // Alias para compatibilidad con la app móvil
router.post('/forgot-password', authController.forgotPassword);
router.get('/verify-reset-token', authController.verifyResetToken);
router.post('/reset-password', authController.resetPassword);
router.post('/push-token', authMiddleware.verifyToken, authController.savePushToken);

// Rutas protegidas
router.get('/me', authMiddleware.verifyToken, authController.getMe);
router.post('/change-password', authMiddleware.verifyToken, authController.changePassword);
router.post('/logout', authMiddleware.verifyToken, authController.logout);

module.exports = router;