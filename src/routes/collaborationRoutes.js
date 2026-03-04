const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadCollaborationFiles');

const {
  getCollaborations,
  getCollaborationById,
  createCollaboration,
  updateCollaboration,
} = require('../controllers/collaborationController');

router.get('/', getCollaborations);
router.get('/:id', getCollaborationById);
router.post('/', verifyToken, upload, createCollaboration);
router.put('/:id', verifyToken, upload, updateCollaboration);

module.exports = router;