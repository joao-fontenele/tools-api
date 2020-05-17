const express = require('express');

const app = express();

app.get('/status', (req, res) => {
  res.json({ message: 'OK' });
});

module.exports = app;
