const { path, axios, mariadb } = require('./modules');

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

  // app.get('/home', (req, res) => {
  //   res.render('Home/index.ejs');
  // });

  // app.get('/login', (req, res) => {
  //   res.sendFile(path.resolve('client', 'src', 'views', 'Login', 'index.html'));
  // });

  // app.get('/profile', (req, res) => {
  //   res.sendFile(
  //     path.resolve('client', 'src', 'views', 'Account', 'index.html')
  //   );
  // });

  app.get('/upload', (req, res) => {
    res.render('Upload/index.ejs');
  });

  app.get('/videos', (req, res) => {});

  //post
  app.post('/upload', (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const filename = req.file.filename;

    const getVideosCntQr = `SELECT COUNT(*) AS idCnt FROM videos`;

    function setVideosDataQr(id, title, author, views, imageURL, description) {
      return `INSERT INTO videos VALUES (${id}, '${title}', '${author}', ${views}, '${imageURL}', '${description}')`;
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
            `/src/assets/thumb/${filename}`,
            description
          ),
          (err, rows, fields) => {
            if (!err && req.file) {
              return res.redirect('/');
            } else {
              console.error('err : ', err);
              return res.sta(404);
            }
          }
        );
      } else {
        console.error('err : ', err);
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
