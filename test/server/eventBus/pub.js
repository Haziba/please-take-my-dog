const eventBus = require('../../../src/server/eventBus.js');

const assert = require('assert');

describe('eventBus', function() {
  describe('pub', function() {
    describe('when there are two subs for an event', () => {
      const entityType = 'test entity type';
      const event = 'test event';
      const entity = 'test entity';
      const data = 'test data';

      let methodCalled = [false, false];
      let eventEntity = [];
      let eventData = [];

      eventBus._subs = {};
      eventBus._subs[entityType] = {};
      eventBus._subs[entityType][event] = [
        (entity, data) => { methodCalled[0] = true; eventEntity[0] = entity; eventData[0] = data; },
        () => { methodCalled[1] = true; },
      ];

      eventBus.pub(entityType, entity, event, data);

      it('should have called the first sub', () => {
        assert.equal(methodCalled[0], true);
      });

      it('should have called the first sub with the entity', () => {
        assert.equal(eventEntity[0], entity);
      });

      it('should have called the first sub with the data', () => {
        assert.equal(eventData[0], data);
      });

      it('should have called the second sub', () => {
        assert.equal(methodCalled[1], true);
      });
    });

    describe('when there are no subs for an event', () => {
      eventBus.pub('test entity type', 'test entity', 'test event', 'test data');

      it('should not blow up', () => {
        assert.equal(true, true);
      });
    });
  });
});