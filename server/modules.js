const express = require('express');
const multer = require('multer');
const axios = require('axios');
const path = require('path');
const mariadb = require('./db/mariadb');

const upload = multer({
  storage: multer.diskStorage({
    filename(req, file, done) {
      const getVideosCntQr = `SELECT COUNT(*) AS idCnt FROM videos`;
      mariadb.query(getVideosCntQr, (err, rows, fields) => {
        const idCnt = rows[0].idCnt;
        const fileEx = file.originalname.split('.')[1];

        if (!err) {
          done(null, `thumb-${idCnt + 1}.${fileEx}`);
        }
      });
    },
    destination(req, file, done) {
      done(null, path.join('client/src/assets/thumb'));
    },
  }),
  limits: {
    fileSize: 1024 * 1024,
  },
});

function setupMiddleware(app) {
  const uploadMiddleware = upload.single('image');

  mariadb.connect();
  app.use(uploadMiddleware);
  app.use(express.json());
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '../client/src/views'));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(path.resolve('client')));
  app.use('/detail', require('./routes/detail.js'));
}

module.exports = {
  express,
  path,
  setupMiddleware,
  upload,
  axios,
  mariadb,
};
