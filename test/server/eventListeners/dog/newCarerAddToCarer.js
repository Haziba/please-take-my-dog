const mock = require('mock-require');
const eventBus = require('../../../../src/server/eventBus.js');

const DB = require('../../../mock/db.js');

const Carer = require('../../../../src/server/entities/carer.js');
const Dog = require('../../../../src/server/entities/dog.js');

const assert = require('assert');

describe('newCarerAddToCarer', function() {
  const carer = Carer.new();
  const dog = Dog.new();

  before(() => {
    require('../../../../src/server/eventListeners/dog/newCarerAddToCarer.js');

    carer.save();
  })

  it('should apply AddDog event to carer', (done) => {
    eventBus.pub('Dog', dog, 'NewCarer', { carerId: carer.uuid }).then(() => {
      Carer.load(carer.uuid).then((newCarer) => {
        assert.equal(newCarer._totalEventsApplied, 1);

        assert.equal(newCarer._events[0].type, 'AddDog');
        assert.equal(newCarer._events[0].body.dogId, dog.uuid);

        done();
      }).catch(done);
    });
  });
});