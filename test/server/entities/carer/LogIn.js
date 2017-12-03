const DB = require('../../../mock/db.js');
const Carer = require('../../../../src/server/entities/carer.js');

const assert = require('assert');

describe('carer', function() {
  describe('LogIn', function() {
    describe('ValidCall', function() {
      const carer = new Carer();

      const password = 'test pass';

      carer.Create('name', 'email', password);
      carer.applyEvents();

      const result = carer.LogIn(password);
      const unappliedEvents = carer.unappliedEvents();

      it('should return true', function() {
        assert.equal(result, true);
      });

      it('should have added two events', () => {
        assert.equal(unappliedEvents.length, 2);
      });
      
      it('should create a LogIn event first', () => {
        assert.equal(unappliedEvents[0].type, 'LogIn');
      });
      
      it('should create a RefreshAuthToken event second', () => {
        assert.equal(unappliedEvents[1].type, 'RefreshAuthToken');
      });
    });

    describe('CallWithoutPassword', function() {
      const carer = new Carer();

      const originalPassword = 'test pass';

      carer.Create('name', 'email', originalPassword);
      carer.applyEvents();

      const result = carer.LogIn(undefined);
      const unappliedEvents = carer.unappliedEvents();

      it('should return false', function() {
        assert.equal(result, false);
      });

      it('should not create any events', () => {
        assert.equal(unappliedEvents.length, 0);
      });
    });
  });
});
