'use strict'

global.chai = require('chai')
global.expect = chai.expect

global.mocha = require('mocha')
global.describe = mocha.describe
global.after = mocha.after
global.it = mocha.it
global.beforeEach = mocha.beforeEach

global.sinon = require('sinon')

global.fetchStub = (endpoint, params = {}) => {
  const queryString = Object.keys(params).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&')
  return Promise.resolve().then(() => `https://everydayhero-staging.com/${endpoint}?${queryString}`)
}

global.enzyme = require('enzyme')
global.shallow = enzyme.shallow
global.mount = enzyme.mount

global.utils = require('./utils')

require('./testdom')('<html><body><div id="mount"><div></body></html>')
