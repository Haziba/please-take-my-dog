
const DB = require('../../../mock/db.js');
const Dog = require('../../../../src/server/entities/dog.js');

const assert = require('assert');

describe('Dog', function() {
  describe('new', function() {
    const carerId = 15;
    const name = 'test dog name';
    const breed = 'test dog breed';
    const size = 'test dog size';
    const images = {};

    const dog = Dog.new(carerId, name, breed, size, images);
    
    it('should not return null', function() {
      assert.notEqual(dog, null);
    });

    it('should have added two events', () => {
      assert.equal(dog._events.length, 2);
    });
    
    it('should create a Create event first', () => {
      assert.equal(dog._events[0].type, 'Create');
    });
    
    it('should create a NewCarer event second', () => {
      assert.equal(dog._events[1].type, 'NewCarer');
    });
  });
});
