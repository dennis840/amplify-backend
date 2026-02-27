const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();

const fileFilterImage = (req, file, cb) => {
  const allowed = /jpeg|jpg|png/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes JPG o PNG'));
  }
};

const fileFilterDemo = (req, file, cb) => {
  const allowedMimes = [
    'audio/mpeg', 'audio/wav', 'audio/aac', 'audio/mp3',
    'video/mp4', 'video/quicktime', 'video/webm'
  ];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos MP3, WAV, AAC, MP4 o MOV'));
  }
};

const uploadImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilterImage,
});

const uploadDemo = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: fileFilterDemo,
});

module.exports = { uploadImage, uploadDemo };