const express = require('express');
const router = express.Router();
const musicianController = require('../controllers/musicianController');
const authMiddleware = require('../middlewares/authMiddleware');

// GET /api/musicians
router.get('/', authMiddleware.verifyToken, musicianController.getMusicians);

// GET /api/musicians/search?q=
router.get('/search', authMiddleware.verifyToken, musicianController.searchMusicians);

// GET /api/musicians/:id
router.get('/:id', authMiddleware.verifyToken, musicianController.getMusicianById);

module.exports = router;