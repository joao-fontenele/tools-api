const { getConfig } = require('../../../app/config/config-factory');
const developmentConfig = require('../../../app/config/development.json');
const testConfig = require('../../../app/config/test.json');
const defaultConfig = require('../../../app/config/default.json');

describe('config module', function () {
  let sandbox;

  beforeEach(function () {
    sandbox = sinon.createSandbox();
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('should load test configs if NODE_ENV is test', function () {
    sandbox.stub(process, 'env').value({ NODE_ENV: 'test' });
    const conf = getConfig();
    const environment = conf.get('env');
    expect(environment).to.be.equal(testConfig.env);
  });

  it('should load development configs if NODE_ENV is development', function () {
    sandbox.stub(process, 'env').value({ NODE_ENV: 'development' });
    const conf = getConfig();
    const environment = conf.get('env');
    expect(environment).to.be.equal(developmentConfig.env);
  });

  it('should merge configs from default config file', function () {
    sandbox.stub(process, 'env').value({ NODE_ENV: 'development' });
    const conf = getConfig();

    // port should be defined in default, but not in development
    expect(developmentConfig.port).to.not.exist;

    const port = conf.get('port');
    expect(port).to.be.equal(defaultConfig.port);
  });
});
