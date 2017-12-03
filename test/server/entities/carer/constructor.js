const DB = require('../../../mock/db.js');
const Carer = require('../../../../src/server/entities/carer.js');

const assert = require('assert');
const passwordHash = require('password-hash');

describe('carer', function() {
  describe('Create', function() {
    describe('ValidCall', function() {
      const name = 'test name';
      const email = 'test email';
      const _password = 'test password';
      const _authToken = 'test authToken';
      const avatar = 'test avatar';
      const dogs = 'test dogs';
      
      const carer = new Carer({ data: {
          name, email, _password, _authToken, avatar, dogs
      }});
      
      it('should set the name', () => {
        carer.name = name;
      });
      
      it('should set the email', () => {
        carer.email = email;
      });
      
      it('should set the _password', () => {
        carer._password = _password;
      });
      
      it('should set the _authToken', () => {
        carer._authToken = _authToken;
      });
      
      it('should set the avatar', () => {
        carer.avatar = avatar;
      });
      
      it('should set the dogs', () => {
        carer.dogs = dogs;
      });
    });
  });
});