const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middlewares/authMiddleware');

// Lista de conversaciones
router.get('/', authMiddleware.verifyToken, messageController.getConversations);

// Enviar mensaje
router.post('/', authMiddleware.verifyToken, messageController.sendMessage);

// Obtener conversación específica
router.get('/:userId', authMiddleware.verifyToken, messageController.getConversation);

module.exports = router;