const express = require('express');
const Mongo = require('../../app/clients/mongo');
const { setupApp } = require('../../app/app');

before(async function () {
  global.app = await setupApp(express());
});

after(async function () {
  await Mongo.disconnect();
});
