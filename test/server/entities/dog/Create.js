const DB = require('../../../mock/db.js');
const Dog = require('../../../../src/server/entities/dog.js');

const assert = require('assert');
const passwordHash = require('password-hash');

describe('Dog', function() {
  describe('Create', function() {
    describe('ValidCall', function() {
      const dog = new Dog();

      const carerId = 15;
      const name = 'test dog name';
      const breed = 'test dog breed';
      const size = 'test dog size';
      const images = {};

      const result = dog.Create(carerId, name, breed, size, images);

      it('should return true', function () {
        assert.equal(result, true);
      });

      it('should have added two events', () => {
        assert.equal(dog._events.length, 2);
      });

      it('should create a Create event first', () => {
        assert.equal(dog._events[0].type, 'Create');
      });

      it('should hold the name', () => {
        assert.equal(dog._events[0].body.name, name);
      });

      it('should hold the breed', () => {
        assert.equal(dog._events[0].body.breed, breed);
      });

      it('should hold the size', () => {
        assert.equal(dog._events[0].body.size, size);
      });

      it('should hold the images', () => {
        assert.equal(dog._events[0].body.images, images);
      })

      it('should create a NewCarer event second', () => {
        assert.equal(dog._events[1].type, 'NewCarer');
      });

      it('should hold the carerId', () => {
        assert.equal(dog._events[1].body.carerId, carerId);
      })
    });

    describe('CallWithNoCarerId', function() {
      const dog = new Dog();

      const name = 'test dog name';
      const breed = 'test dog breed';
      const size = 'test dog size';
      const images = {};

      const result = dog.Create(undefined, name, breed, size, images);

      it('should return false', function() {
        assert.equal(result, false);
      });

      it('should not create any events', () => {
        assert.equal(dog._events.length, 0);
      });
    });

    describe('CallWithNoBreed', function() {
      const dog = new Dog();

      const carerId = 15;
      const name = 'test dog name';
      const size = 'test dog size';
      const images = {};

      const result = dog.Create(carerId, name, undefined, size, images);

      it('should return false', function() {
        assert.equal(result, false);
      });

      it('should not create any events', () => {
        assert.equal(dog._events.length, 0);
      });
    });

    describe('CallWithNoSize', function() {
      const dog = new Dog();

      const carerId = 15;
      const name = 'test dog name';
      const breed = 'test dog breed';
      const images = {};

      const result = dog.Create(carerId, name, breed, undefined, images);

      it('should return false', function() {
        assert.equal(result, false);
      });

      it('should not create any events', () => {
        assert.equal(dog._events.length, 0);
      });
    });

    describe('CallWithNoImages', function() {
      const dog = new Dog();

      const carerId = 15;
      const name = 'test dog name';
      const breed = 'test dog breed';
      const size = 'test dog size';

      const result = dog.Create(carerId, name, breed, size, undefined);

      it('should return true', function() {
        assert.equal(result, true);
      });

      it('should have added two events', () => {
        assert.equal(dog._events.length, 2);
      });
    });
  });
});
