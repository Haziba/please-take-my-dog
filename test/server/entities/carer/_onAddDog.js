const Carer = require('../../../../src/server/entities/carer.js');

const assert = require('assert');

describe('carer', function() {
  describe('_onAddDog', function() {
    const carer = new Carer();

    const dogId = 15;

    carer.createEvent('AddDog', {
      dogId
    });

    carer.applyEvents();

    it('should have dogId added to dogs', () => {
      assert.deepEqual(carer.dogs, [dogId]);
    });
  });
});
