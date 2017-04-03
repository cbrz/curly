'use strict';

const chai = require('chai');
chai.config.includeStack = true;

const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

global.expect = chai.expect;
global.AssertionError = chai.AssertionError;
global.Assertion = chai.Assertion;
global.assert = chai.assert;

