const DB = require('../../../mock/db.js');
const Carer = require('../../../../src/server/entities/carer.js');

const assert = require('assert');

describe('carer', function() {
  describe('_onLogIn', function() {
    const carer = new Carer();

    const name = 'test name';
    const avatar = 'test avatar';

    carer.createEvent('Update', {name: name, avatar: avatar});

    carer.applyEvents();

    it('should set the name', () => {
      assert.equal(carer.name, name);
    });

    it('should set the avatar', () => {
      assert.equal(carer.avatar, avatar);
    });
  });
});
