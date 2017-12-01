require('../../../mock.js');
const Carer = require('../../../../src/server/entities/carer.js');

const assert = require('assert');
const passwordHash = require('password-hash');

describe('carer', function() {
  describe('Create', function() {
    describe('ValidCall', function() {
      const carer = new Carer();

      const name = 'test name';
      const email = 'test email';
      const password = 'test password';

      const result = carer.Create(name, email, password);

      it('should return true', function() {
        assert.equal(result, true);
      });

      it('should have two events', () => {
        assert.equal(carer._events.length, 2);
      });

      it('should create a Create event first', () => {
        assert.equal(carer._events[0].type, 'Create');
      });

      it('should hold the name', () => {
        assert.equal(carer._events[0].body.name, name);
      });

      it('should hold the email', () => {
        assert.equal(carer._events[0].body.email, email);
      });

      it('should hold the hashed password', () => {
        assert.equal(passwordHash.verify(password, carer._events[0].body.password), true);
      });

      it('should create a RefreshAuthToken event second', () => {
        assert.equal(carer._events[1].type, 'RefreshAuthToken');
      });

      it('should hold the auth token', () => {
        assert.notEqual(carer._events[1].body._authToken, undefined);
      });
    });

    describe('CallWithNoPassword', function() {
      const carer = new Carer();

      const name = 'test name';
      const email = 'test email';
      const password = '';

      const result = carer.Create(name, email, password);

      it('should return false', function() {
        assert.equal(result, false);
      });

      it('should not create any events', () => {
        assert.equal(carer._events.length, 0);
      });
    });

    describe('CallWithNoName', function() {
      const carer = new Carer();

      const name = '';
      const email = 'test email';
      const password = 'test password';

      const result = carer.Create(name, email, password);

      it('should return false', function() {
        assert.equal(result, false);
      });

      it('should not create any events', () => {
        assert.equal(carer._events.length, 0);
      });
    });

    describe('CallWithNoEmail', function() {
      const carer = new Carer();

      const name = 'test name';
      const email = '';
      const password = 'test password';

      const result = carer.Create(name, email, password);

      it('should return false', function() {
        assert.equal(result, false);
      });

      it('should not create any events', () => {
        assert.equal(carer._events.length, 0);
      });
    });
  });
});
