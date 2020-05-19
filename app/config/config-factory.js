const nconf = require('nconf');
const path = require('path');

function getConfig() {
  const env = process.env.NODE_ENV || 'development';

  nconf
    .argv() // allows cli config overrides
    .env() // load env variables configs
    .file('environment', { // main config file
      file: path.join(__dirname, `${env}.json`),
    })
    .file('default', { // fallback config file
      file: path.join(__dirname, 'default.json'),
    });

  nconf.set('NODE_ENV', env);
  return nconf;
}

module.exports = {
  getConfig,
};
