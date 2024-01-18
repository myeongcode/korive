const { path } = require('./modules');

function setupRoutes(app) {
  //get
  app.get('/', (req, res) => {
    res.sendFile(path.resolve('client', 'index.html'));
  });

  app.get('/home', (req, res) => {
    res.sendFile(path.resolve('client', 'src', 'views', 'Home', 'index.html'));
  });

  app.get('/login', (req, res) => {
    res.sendFile(path.resolve('client', 'src', 'views', 'Login', 'index.html'));
  });

  app.get('/profile', (req, res) => {
    res.sendFile(
      path.resolve('client', 'src', 'views', 'Account', 'index.html')
    );
  });

  app.get('/upload', (req, res) => {
    res.sendFile(
      path.resolve('client', 'src', 'views', 'Upload', 'index.html')
    );
  });

  //post
  app.post('/upload', (req, res) => {
    console.log(req.file);

    if (!req.file) return res.status(404);

    return res.redirect('/home');
  });

  //다음 코드 위에다가 넣어야 get, post인식을 함
  app.use((req, res) => {
    res.status(404).send('Not Found');
  });
}

module.exports = {
  setupRoutes,
};
