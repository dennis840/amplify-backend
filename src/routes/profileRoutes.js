const express = require('express');
const router = express.Router();
const { uploadImage, uploadDemo } = require('../middlewares/uploadProfileImage');
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middlewares/authMiddleware');

router.put('/', authMiddleware.verifyToken, uploadImage.single('image'), profileController.createProfile);
router.put('/step2', authMiddleware.verifyToken, profileController.updateProfileStep2);
router.put('/step3', authMiddleware.verifyToken, uploadDemo.single('demo'), profileController.updateProfileStep3);
router.get('/me', authMiddleware.verifyToken, profileController.getProfile);
router.get('/:userId', profileController.getProfile);

module.exports = router;