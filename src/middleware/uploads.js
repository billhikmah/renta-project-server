/* eslint-disable consistent-return */
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const path = require("path");
const wrapper = require("../utils/wrapper");
const cloudinary = require("../config/cloudinary");

// const timeout = require('connect-timeout')

module.exports = {
  uploadImage: (request, response, next) => {
    const storage = new CloudinaryStorage({
      cloudinary,
      params: {
        folder: "renta-project",
      },
    });
    const largeSize = 500000;
    const upload = multer({
      storage,
      fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        if (
          ext !== ".jpg" &&
          ext !== ".jpeg" &&
          ext !== ".png" &&
          ext !== ".PNG"
        ) {
          cb(new Error("Only type .jpeg/jpg/png are allowed"), false);
          return;
        }
        cb(null, true);
      },
      limits: { fileSize: largeSize },
    // }).single("image", { timeout: 600000 });
    }).single("image");

    upload(request, response, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        return wrapper.response(response, 401, err.message, null);
      }
      if (err) {
        // An unknown error occurred when uploading.
        return wrapper.response(response, 401, err.message, null);
      }
      // Everything went fine.
      next();
    });
  },
};
