require('../../../mock.js');
const Carer = require('../../../../src/server/entities/carer.js');

const assert = require('assert');

describe('carer', function() {
  describe('_onRefreshAuthToken', function() {
    const carer = new Carer();

    const _authToken = "test auth token";

    carer.createEvent('RefreshAuthToken', {_authToken});

    carer.applyEvents();

    it('should set the _authToken', () => {
      assert.equal(carer._authToken, _authToken);
    });
  });
});
