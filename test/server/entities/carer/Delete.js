const DB = require('../../../mock/db.js');
const Carer = require('../../../../src/server/entities/carer.js');

const assert = require('assert');

describe('carer', function() {
  describe('Delete', function() {
    describe('ValidCall', function() {
      const carer = new Carer();

      const result = carer.Delete();

      it('should return true', function() {
        assert.equal(result, true);
      });

      it('should have one event', () => {
        assert.equal(carer._events.length, 1);
      });

      it('should create an Delete event', () => {
        assert.equal(carer._events[0].type, 'Delete');
      });
    });
  });
});
