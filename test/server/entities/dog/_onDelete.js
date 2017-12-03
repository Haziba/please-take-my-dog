const Dog = require('../../../../src/server/entities/dog.js');

const assert = require('assert');

describe('Dog', function() {
  describe('_onDelete', function() {
    const dog = new Dog();

    dog.createEvent('Delete');

    dog.applyEvents();

    it('should set deleted to true', () => {
      assert.deepEqual(dog.deleted, true);
    });
  });
});
