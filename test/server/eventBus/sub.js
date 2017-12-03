const eventBus = require('../../../src/server/eventBus.js');

const assert = require('assert');

describe('eventBus', function() {
  describe('sub', function() {
    before(() => {
      eventBus.reset();
    })

    afterEach(() => {
      eventBus.reset();
    });

    describe('when there are no subs for the entityType', () => {
      const entityType = 'test entityType';
      const event = 'test event';
      const callback = function(){};

      const expectedSubs = {};
      expectedSubs[entityType] = {};
      expectedSubs[entityType][event] = [callback];

      it('should add the subscriber', () => {
        eventBus.sub(entityType, event, callback);

        assert.deepEqual(eventBus._subs, expectedSubs);
      });
    });

    describe('when there are no subs for the event', () => {
      const entityType = 'test entityType';
      const event = 'test event';
      const callback = function(){};

      eventBus._sub = {};
      eventBus._sub[entityType] = {};

      const expectedSubs = {};
      expectedSubs[entityType] = {};
      expectedSubs[entityType][event] = [callback];

      it('should add the subscriber', () => {
        eventBus.sub(entityType, event, callback);

        assert.deepEqual(eventBus._subs, expectedSubs);
      });
    });

    describe ('when there are subs for the event', () => {
      const entityType = 'test entityType';
      const event = 'test event';
      const callback = function(){};

      const oldSub = function(){};

      const expectedSubs = {};
      expectedSubs[entityType] = {};
      expectedSubs[entityType][event] = [oldSub, callback];

      beforeEach(() => {
        eventBus._subs = {};
        eventBus._subs[entityType] = {};
        eventBus._subs[entityType][event] = [oldSub];
      });

      it('should add the subscriber', () => {
        eventBus.sub(entityType, event, callback);

        assert.deepEqual(eventBus._subs, expectedSubs);
      });
    });
  });
});