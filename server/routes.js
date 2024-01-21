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
    console.log(req.file);

    if (!req.file) return res.status(404);

    return res.redirect('/');
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
