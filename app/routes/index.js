const tools = require('./tools');

const routes = [
  tools,
];

function setupRoutes(app) {
  routes.forEach((route) => route.setupRoutes(app));
  return app;
}

module.exports = {
  setupRoutes,
};
