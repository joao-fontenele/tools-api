const middlewares = require('./middlewares');

function setupApp(app) {
  middlewares.setupMainMiddlewares(app);

  return app;
}

module.exports = {
  setupApp,
};
