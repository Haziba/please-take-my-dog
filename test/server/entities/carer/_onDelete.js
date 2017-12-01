const Carer = require('../../../../src/server/entities/carer.js');

const assert = require('assert');

describe('carer', function() {
  describe('_onDelete', function() {
    const carer = new Carer();

    carer.createEvent('Delete');

    carer.applyEvents();

    it('should set deleted to true', () => {
      assert.deepEqual(carer.deleted, true);
    });
  });
});
