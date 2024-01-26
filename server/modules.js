const express = require('express');
const multer = require('multer');
const axios = require('axios');
const path = require('path');
const mariadb = require('./db/mariadb');
const fs = require('fs');

const upload = multer({
  storage: multer.diskStorage({
    filename(req, file, done) {
      // const getVideosCntQr = `SELECT COUNT(*) AS idCnt FROM videos`;
      // mariadb.query(getVideosCntQr, (err, rows, fields) => {
      //   const idCnt = rows[0].idCnt;
      //   const fileEx = file.originalname.split('.')[1];
      //   if (!err) {
      //     done(null, `thumb-${idCnt + 1}.${fileEx}`);
      //   }
      // });
      done(null, file.originalname);
    },
    destination(req, file, done) {
      const uploadUrl = path.join('server/data');
      const getVideosCntQr = `SELECT COUNT(*) AS idCnt FROM videos`;

      mariadb.query(getVideosCntQr, (err, rows, fields) => {
        const idCnt = rows[0].idCnt;
        if (!err) {
          if (!fs.existsSync(`${uploadUrl}/${idCnt + 1}`)) {
            fs.mkdirSync(`${uploadUrl}/${idCnt + 1}`);
          }
          done(null, `${uploadUrl}/${idCnt + 1}`);
        } else {
          console.error('DBerr : ', err);
        }
      });
    },
  }),
  limits: {
    files: 2,
  },
});

function setupMiddleware(app) {
  const uploadMiddleware = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 },
  ]);

  mariadb.connect();
  app.use(uploadMiddleware);
  app.use(express.json());
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '../client/src/views'));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(path.resolve('client')));
  app.use('/server/data', express.static(path.resolve('server/data')));
  app.use('/detail', require('./routes/detail.js'));
}

module.exports = {
  express,
  path,
  setupMiddleware,
  upload,
  axios,
  mariadb,
  fs,
};
