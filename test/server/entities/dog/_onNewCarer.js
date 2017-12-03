const Dog = require('../../../../src/server/entities/dog.js');

const assert = require('assert');

describe('Dog', function() {
  describe('_onNewCarer', function() {
    const dog = new Dog();

    const carerId = 15;

    dog.createEvent('NewCarer', {
      carerId
    });

    dog.applyEvents();

    it('should set the carerid', () => {
      assert.equal(dog.carerid, carerId);
    });
  });
});