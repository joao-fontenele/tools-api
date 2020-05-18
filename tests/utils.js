function stubLogger(sandbox, logger) {
  sandbox.stub(logger, 'trace');
  sandbox.stub(logger, 'debug');
  sandbox.stub(logger, 'info');
  sandbox.stub(logger, 'warn');
  sandbox.stub(logger, 'error');
  sandbox.stub(logger, 'fatal');
}

module.exports = {
  stubLogger,
};
