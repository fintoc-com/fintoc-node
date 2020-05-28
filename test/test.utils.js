/* eslint-disable prefer-arrow-callback */

const assert = require('assert');
const utils = require('../src/utils');

describe('Fintoc Utilities library', function () {
  this.beforeEach(function () {
    this.dict = { spam: 42, ham: 'spam', bacon: { spam: -1 } };
  });

  describe('Pick function tests', function () {
    it('Should get the correct sub-object', function () {
      assert.deepEqual(utils.pick(this.dict, 'ham'), { ham: 'spam' });
    });

    it('Should get an empty object', function () {
      assert.deepEqual(utils.pick(this.dict, 'eggs'), { });
    });
  });

  describe('Rename Properties function tests', function () {
    it('Should rename every key correctly', function () {
      assert.deepEqual(
        utils.renameProperties(this.dict, ['spam', 'eggs']),
        { eggs: 42, ham: 'spam', bacon: { eggs: -1 } },
      );
    });
  });

  describe('Snake to Pascal function tests', function () {
    it('Should get the correct pascal-cased string', function () {
      assert.equal(
        utils.snakeToPascal('this_example_should_be_good_enough'),
        'ThisExampleShouldBeGoodEnough',
      );
    });

    it('Should get the correct pascal-cased string', function () {
      assert.equal(
        utils.snakeToPascal('internal_server_error_error'),
        'InternalServerErrorError',
      );
    });
  });
});
