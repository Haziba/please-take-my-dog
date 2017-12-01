require('../../../mock.js');
const Carer = require('../../../../src/server/entities/carer.js');

const assert = require('assert');

describe('carer', function() {
  describe('Update', function() {
    describe('ValidCall', function() {
      const carer = new Carer();

      const name = 'test name';
      const avatar = 'test avatar';

      const result = carer.Update(name, avatar);

      it('should return true', function() {
        assert.equal(result, true);
      });

      it('should have added one event', () => {
        assert.equal(carer._events.length, 1);
      });
      
      it('should create an Update event', () => {
        assert.equal(carer._events[0].type, 'Update');
      });
      
      it('should have the name on the event body', () => {
        assert.equal(carer._events[0].body.name, name);
      });
      
      it('should have the avatar on the event body', () => {
        assert.equal(carer._events[0].body.avatar, avatar);
      });
    });

    describe('CallWithoutName', function() {
      const carer = new Carer();

      const avatar = 'test avatar';

      const result = carer.Update(undefined, avatar);

      it('should return false', function() {
        assert.equal(result, false);
      });

      it('should not create any events', () => {
        assert.equal(carer._events.length, 0);
      });
    });

    describe('CallWithoutAvatar', function() {
      const carer = new Carer();

      const name = 'test name';

      const result = carer.Update(name, undefined);

      it('should return true', function() {
        assert.equal(result, true);
      });

      it('should have added one event', () => {
        assert.equal(carer._events.length, 1);
      });
      
      it('should create an Update event', () => {
        assert.equal(carer._events[0].type, 'Update');
      });
      
      it('should have the name on the event body', () => {
        assert.equal(carer._events[0].body.name, name);
      });
      
      it('should have undefined avatar on the event body', () => {
        assert.equal(carer._events[0].body.avatar, undefined);
      });
    });
  });
});
