require('dotenv').config();
const express = require('express');
const { setupApp } = require('./app/app');
const config = require('./app/config');
const logger = require('./app/utils/logger');

const app = setupApp(express());

setupApp(app);

const port = config.get('port');

app.listen(port, () => {
  // eslint-disable-next-line no-console
  logger.info(`tools-api listening on port ${port}`);
});
