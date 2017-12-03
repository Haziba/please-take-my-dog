const DB = require('../../../mock/db.js');
const Carer = require('../../../../src/server/entities/carer.js');

const assert = require('assert');

describe('carer', function() {
  describe('_onLogIn', function() {
    const carer = new Carer();

    carer.createEvent('LogIn', null);

    carer.applyEvents();

    // Just checking nothing blows up
  });
});
