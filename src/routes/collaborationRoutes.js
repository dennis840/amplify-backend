const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadCollaborationFiles');
const {
  getCollaborations,
  getCollaborationById,
  createCollaboration,
  updateCollaboration,
  deleteCollaboration,
  getMyCollaborations,
} = require('../controllers/collaborationController');

router.get('/', getCollaborations);
router.get('/my', verifyToken, getMyCollaborations);
router.get('/:id', getCollaborationById);
router.post('/', verifyToken, upload, createCollaboration);
router.put('/:id', verifyToken, upload, updateCollaboration);
router.delete('/:id', verifyToken, deleteCollaboration);

module.exports = router;