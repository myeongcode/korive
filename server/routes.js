const { path, axios, mariadb, upload, fs } = require('./modules');

function setupRoutes(app) {
  //get
  app.get('/', async (req, res) => {
    try {
      const getVideoAPI = 'http://localhost:8080/api/videos';
      const response = await axios.get(getVideoAPI);
      res.render('Home/index.ejs', {
        data: response.data,
      });
    } catch (e) {
      console.error('Error fetching data from API : ', e);
      res.status(500).send('Internal Server Error');
    }
  });

  app.get('/upload', (req, res) => {
    res.render('Upload/index.ejs');
  });

  app.get('/videos', (req, res) => {});

  //post
  app.post('/upload', (req, res) => {
    const uploadUrl = path.join('/server/data');

    const title = req.body.title;
    const description = req.body.description;
    const imageFile = req.files['image'][0];
    const videoFile = req.files['video'][0];

    const getVideosCntQr = `SELECT COUNT(*) AS idCnt FROM videos`;
    function setVideosDataQr(
      id,
      title,
      author,
      views,
      imageURL,
      description,
      videoURL
    ) {
      return `INSERT INTO videos VALUES (${id}, '${title}', '${author}', ${views}, '${imageURL}', '${description}', '${videoURL}')`;
    }

    mariadb.query(getVideosCntQr, (err, rows, fields) => {
      if (!err) {
        const idCnt = rows[0].idCnt;
        mariadb.query(
          setVideosDataQr(
            idCnt + 1,
            title,
            'Myeong',
            40,
            `${uploadUrl}/${idCnt + 1}/${imageFile.filename}`,
            description,
            `${uploadUrl}/${idCnt + 1}/${videoFile.filename}`
          ),
          (err, rows, fields) => {
            if (!err && req.files) {
              return res.redirect('/');
            } else {
              console.error('query err : ', err);
              return res.status(404);
            }
          }
        );
      } else {
        console.error('DBerr : ', err);
      }
    });
  });

  //api
  app.get('/api/videos', (req, res) => {
    mariadb.query(`SELECT * FROM videos`, (err, rows, fields) => {
      if (!err) {
        res.status(200).send(rows);
      } else {
        console.error('err : ', err);
      }
    });
  });

  app.get('/api/images', (req, res) => {
    res.send(path.resolve('client/src/assets/card'));
  });

  app.get('/api/images/:imageId', (req, res) => {
    res.sendFile(path.resolve('client/src/assets/card/', req.params.imageId));
  });

  //다음 코드 위에다가 넣어야 get, post인식을 함
  app.use((req, res) => {
    res.status(404).send('Not Found');
  });
}

module.exports = {
  setupRoutes,
};
