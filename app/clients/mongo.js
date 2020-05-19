const mongoose = require('mongoose');

const config = require('../config');

const Mongo = {
  getConnection() {
    return mongoose.connection;
  },
  disconnect() {
    return mongoose.disconnect();
  },
  connect() {
    return mongoose.connect(
      config.get('mongo:url'),
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      },
    );
  },
};

module.exports = Mongo;
