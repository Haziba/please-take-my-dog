require('../../../mock.js');
const Carer = require('../../../../src/server/entities/carer.js');

const assert = require('assert');

describe('carer', function() {
  describe('RefreshAuthToken', function() {
    describe('ValidCall', function() {
      const carer = new Carer();

      const result = carer.RefreshAuthToken();

      it('should return true', function() {
        assert.equal(result, true);
      });

      it('should have added one event', () => {
        assert.equal(carer._events.length, 1);
      });
      
      it('should create a LogIn event first', () => {
        assert.equal(carer._events[0].type, 'RefreshAuthToken');
      });
      
      it('should have an _authToken value on the event body', () => {
        assert.notEqual(carer._events[0].body._authToken, null);
      });
    });
  });
});
