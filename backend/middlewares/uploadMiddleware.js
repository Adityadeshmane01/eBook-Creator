const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Check file type
function checkFileType(file, cb) {
  const allowedTypes = new Map([
    [".jpg", ["image/jpeg", "image/jpg"]],
    [".jpeg", ["image/jpeg", "image/jpg"]],
    [".png", ["image/png", "image/x-png"]],
    [".webp", "image/webp"],
    [".gif", "image/gif"],
    [".bmp", "image/bmp"],
    [".avif", "image/avif"],
    [".tif", "image/tiff"],
    [".tiff", "image/tiff"],
    [".heic", "image/heic"],
    [".heif", "image/heif"],
  ]);
  const extension = path.extname(file.originalname).toLowerCase();
  const expectedMimeType = allowedTypes.get(extension);

  if (expectedMimeType && expectedMimeType.includes(file.mimetype)) {
    return cb(null, true);
  }

  cb(new Error("Cover must be a JPG, JPEG, PNG, WebP, GIF, BMP, or AVIF image."));
}

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("cover");

module.exports = upload;