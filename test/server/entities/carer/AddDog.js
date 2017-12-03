const DB = require('../../../mock/db.js');
const Carer = require('../../../../src/server/entities/carer.js');

const assert = require('assert');

describe('carer', function() {
  describe('AddDog', function() {
    describe('ValidCall', function() {
      const carer = new Carer();

      const dogId = 15;

      const result = carer.AddDog(dogId);

      it('should return true', function() {
        assert.equal(result, true);
      });

      it('should have one event', () => {
        assert.equal(carer._events.length, 1);
      });

      it('should create an AddDog event', () => {
        assert.equal(carer._events[0].type, 'AddDog');
      });
    });

    describe('CallWithoutDogId', function() {
      const carer = new Carer();

      const result = carer.AddDog(undefined);

      it('should return false', function() {
        assert.equal(result, false);
      });

      it('should not create any events', () => {
        assert.equal(carer._events.length, 0);
      });
    });
  });
});
