const { errors } = require('celebrate');
const middlewares = require('./middlewares');
const routes = require('./routes');
const MongoClient = require('./clients/mongo');

async function setupApp(app) {
  middlewares.setupMainMiddlewares(app);

  routes.setupRoutes(app);

  await MongoClient.connect();

  // joi validation error handler. Has to be after the routes
  app.use(errors());

  return app;
}

module.exports = {
  setupApp,
};
