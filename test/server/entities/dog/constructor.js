const DB = require('../../../mock/db.js');
const Dog = require('../../../../src/server/entities/dog.js');

const assert = require('assert');
const passwordHash = require('password-hash');

describe('Dog', function() {
  describe('Create', function() {
    describe('ValidCall', function() {
      const carerid = 15;
      const name = 'test name';
      const breed = 'test breed';
      const location = 'test location';
      const size = 'test size';
      const images = 'test images';
      const transfercarerid = 'test transfercarerid';
      const carerhistory = 'test carerhistory';
      
      const dog = new Dog({ data: {
          name, breed, location, size, images, transfercarerid, carerhistory
      }});
      
      it('should set the name', () => {
        dog.name = name;
      });
      
      it('should set the breed', () => {
        dog.breed = breed;
      });
      
      it('should set the location', () => {
        dog.location = location;
      });
      
      it('should set the size', () => {
        dog.size = size;
      });
      
      it('should set the images', () => {
        dog.images = images;
      });
      
      it('should set the transfercarerid', () => {
        dog.transfercarerid = transfercarerid;
      });
      
      it('should set the carerhistory', () => {
        dog.carerhistory = carerhistory;
      });
    });
  });
});