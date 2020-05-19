require('dotenv').config();
const express = require('express');
const { setupApp } = require('./app/app');
const config = require('./app/config');
const logger = require('./app/utils/logger');

const port = config.get('port');

setupApp(express())
  .then((app) => app.listen(port, () => {
    logger.info(`tools-api listening on port ${port}`);
  }));
