const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    if (file.fieldname === "cover_image") {
      return {
        folder: "collaborations/covers",
        resource_type: "image",
      };
    }

    if (file.fieldname === "demo_file") {
      return {
        folder: "collaborations/demos",
        resource_type: "auto",
      };
    }
  },
});

const upload = multer({ storage });

module.exports = upload.fields([
  { name: "cover_image", maxCount: 1 },
  { name: "demo_file", maxCount: 1 },
]);