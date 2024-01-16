const express = require('express');
const multer = require('multer');
const path = require('path');

const upload = multer({
  storage: multer.diskStorage({
    filename(req, file, done) {
      done(null, file.originalname);
    },
    destination(req, file, done) {
      done(null, path.join(__dirname, 'uploads'));
    },
  }),
});

function setupMiddleware(app) {
  const uploadMiddleware = upload.single('fileInput');

  app.use(uploadMiddleware);
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(path.resolve('client')));
}

module.exports = {
  express,
  path,
  setupMiddleware,
  upload,
};
