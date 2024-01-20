const { path, axios } = require('./modules');

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

  //post
  app.post('/upload', (req, res) => {
    console.log(req.file);

    if (!req.file) return res.status(404);

    return res.redirect('/home');
  });

  //api
  app.get('/api/videos', (req, res) => {
    res.status(200).json([
      {
        id: 1,
        title: '영상1',
        author: '김진성',
        views: 4103,
        imageUrl: '/src/assets/card/thumb-mock.jpg',
      },
      {
        id: 2,
        title: '영상2',
        author: '안정수',
        views: 331,
        imageUrl: '/src/assets/card/thumb-mock.jpg',
      },
      {
        id: 3,
        title: '영상3',
        author: '우명규',
        views: 88881,
        imageUrl: '/src/assets/card/thumb-mock.jpg',
      },
    ]);
  });

  //다음 코드 위에다가 넣어야 get, post인식을 함
  app.use((req, res) => {
    res.status(404).send('Not Found');
  });
}

module.exports = {
  setupRoutes,
};
