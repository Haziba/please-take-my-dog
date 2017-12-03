const DB = require('../../../mock/db.js');
const Carer = require('../../../../src/server/entities/carer.js');

const assert = require('assert');

describe('carer', function() {
  describe('new', function() {
    const name = 'test name';
    const email = 'test email';
    const password = 'test pass';

    const carer = Carer.new(name, email, password);
    
    it('should not return null', function() {
      assert.notEqual(carer, null);
    });

    it('should have added two events', () => {
      assert.equal(carer._events.length, 2);
    });
    
    it('should create a Create event first', () => {
      assert.equal(carer._events[0].type, 'Create');
    });
    
    it('should create a RefreshAuthToken event second', () => {
      assert.equal(carer._events[1].type, 'RefreshAuthToken');
    });
  });
});
