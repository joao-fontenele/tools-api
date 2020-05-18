const Prometheus = require('prom-client');
const bodyParser = require('body-parser');
const compression = require('compression');
const expressPinoLogger = require('express-pino-logger');
const helmet = require('helmet');
const promMid = require('express-prometheus-middleware');

const logger = require('../utils/logger');

const prometheusMiddleware = promMid({
  metricsPath: '/metrics',
  collectDefaultMetrics: true,
  collecGCMetrics: true,
  requestDurationBuckets: Prometheus.exponentialBuckets(0.1, 2, 7),
  prefix: 'tools_api_',
});

function setupMainMiddlewares(app) {
  // apply security in headers
  app.use(helmet());

  // compress responses depending on header options
  app.use(compression());

  // logs req/res
  app.use(expressPinoLogger({ logger }));

  // parse req bodies from json, or url encoded forms
  app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));
  app.use(bodyParser.json({ limit: '1mb' }));

  // export metrics to prometheus
  app.use(prometheusMiddleware);

  return app;
}

module.exports = {
  setupMainMiddlewares,
};
