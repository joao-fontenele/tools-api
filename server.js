const app = require('./app/app');

const PORT = 3000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`tools-api listening on port ${PORT}`);
});
