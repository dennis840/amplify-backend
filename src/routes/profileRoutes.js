const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");
const multer = require("multer");
const profileController = require("../controllers/profileController");

const upload = multer();

// Step 1
router.put(
  "/",
  verifyToken,
  upload.single("image"),
  profileController.createProfile
);

// Step 2
router.put(
  "/step2",
  verifyToken,
  profileController.updateProfileStep2
);

// Step 3
router.put(
  "/step3",
  verifyToken,
  upload.single("demo"),
  profileController.updateProfileStep3
);

// GET perfil propio
router.get(
  "/me",
  verifyToken,
  profileController.getProfile
);

// Update completo
router.put(
  "/update",
  verifyToken,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "demo", maxCount: 1 }
  ]),
  profileController.updateFullProfile
);

// GET perfil público
router.get("/:userId", profileController.getProfile);

module.exports = router;