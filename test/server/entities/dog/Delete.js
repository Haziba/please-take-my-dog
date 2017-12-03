require('../../../mock.js');
const Dog = require('../../../../src/server/entities/dog.js');

const assert = require('assert');

describe('Dog', function() {
  describe('Delete', function() {
    describe('ValidCall', function() {
      const dog = new Dog();

      const result = dog.Delete();

      it('should return true', function() {
        assert.equal(result, true);
      });

      it('should have one event', () => {
        assert.equal(dog._events.length, 1);
      });

      it('should create an Delete event', () => {
        assert.equal(dog._events[0].type, 'Delete');
      });
    });
  });
});
