const DB = require('../../../mock/db.js');
const Dog = require('../../../../src/server/entities/dog.js');

const assert = require('assert');

describe('Dog', function() {
  describe('Update', function() {
    describe('ValidCall', function() {
      const dog = new Dog();

      const name = 'test name';
      const breed = 'test breed';
      const size = 'test size';
      const images = 'test images';

      const result = dog.Update(name, breed, size, images);

      it('should return true', function() {
        assert.equal(result, true);
      });

      it('should have added one event', () => {
        assert.equal(dog._events.length, 1);
      });
      
      it('should create an Update event', () => {
        assert.equal(dog._events[0].type, 'Update');
      });
      
      it('should have the name on the event body', () => {
        assert.equal(dog._events[0].body.name, name);
      });
      
      it('should have the breed on the event body', () => {
        assert.equal(dog._events[0].body.breed, breed);
      });
      
      it('should have the size on the event body', () => {
        assert.equal(dog._events[0].body.size, size);
      });
      
      it('should have the images on the event body', () => {
        assert.equal(dog._events[0].body.images, images);
      });
    });

    describe('CallWithoutName', function() {
      const dog = new Dog();

      const breed = 'test breed';
      const size = 'test size';
      const images = 'test images';

      const result = dog.Update(undefined, breed, size, images);

      it('should return false', function() {
        assert.equal(result, false);
      });

      it('should not create any events', () => {
        assert.equal(dog._events.length, 0);
      });
    });

    describe('CallWithoutBreed', function() {
      const dog = new Dog();

      const name = 'test name';
      const size = 'test size';
      const images = 'test images';

      const result = dog.Update(name, undefined, size, images);

      it('should return false', function() {
        assert.equal(result, false);
      });

      it('should not create any events', () => {
        assert.equal(dog._events.length, 0);
      });
    });

    describe('CallWithoutSize', function() {
      const dog = new Dog();

      const name = 'test name';
      const breed = 'test breed';
      const images = 'test images';

      const result = dog.Update(name, breed, undefined, images);

      it('should return false', function() {
        assert.equal(result, false);
      });

      it('should not create any events', () => {
        assert.equal(dog._events.length, 0);
      });
    });

    describe('CallWithoutImages', function() {
      const dog = new Dog();

      const name = 'test name';
      const breed = 'test breed';
      const size = 'test size';

      const result = dog.Update(name, breed, size, undefined);

      it('should return true', function() {
        assert.equal(result, true);
      });

      it('should create one event', () => {
        assert.equal(dog._events.length, 1);
      });

      it('should create an Update event', () => {
        assert.equal(dog._events[0].type, 'Update');
      })
    });
  });
});
