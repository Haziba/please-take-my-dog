const Dog = require('../../../../src/server/entities/dog.js');

const assert = require('assert');

describe('Dog', function() {
  describe('_onNewCarer', function() {
    const dog = new Dog();

    const carerId = 15;
    const on = Date.now();

    dog.createEvent('NewCarer', {
      carerId,
      on
    });

    dog.applyEvents();

    it('should set the carerid', () => {
      assert.equal(dog.carerid, carerId);
    });

    it('should add the carer to the carerHistory', () => {
      assert.deepEqual(dog.carerhistory, [{carerId: carerId, on: on}]);
    })
  });
});