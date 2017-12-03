require('../../../mock.js');
const Dog = require('../../../../src/server/entities/dog.js');

const assert = require('assert');

describe('Dog', function() {
  describe('_onUpdate', function() {
    const dog = new Dog();

    const name = 'test name';
    const breed = 'test breed';
    const size = 'test size';
    const images = 'test images';

    dog.createEvent('Update', {name, breed, size, images});

    dog.applyEvents();

    it('should set the name', () => {
      assert.equal(dog.name, name);
    });

    it('should set the breed', () => {
      assert.equal(dog.breed, breed);
    });

    it('should set the size', () => {
      assert.equal(dog.size, size);
    });

    it('should set the images', () => {
      assert.equal(dog.images, images);
    });
  });
});
