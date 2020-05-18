const chai = require('chai');
const sinon = require('sinon');
const supertest = require('supertest');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);

global.sinon = sinon;
global.expect = chai.expect;
global.request = supertest;
