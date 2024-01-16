const { express, setupMiddleware } = require('./server/modules');
const { setupRoutes } = require('./server/routes');

const app = express();

//modules
setupMiddleware(app);

//routes
setupRoutes(app);

app.listen(8080, () => console.log('server on 8080'));
