const Carer = require('../../../src/server/entities/carer.js');

const assert = require('assert');

describe('carer', function() {
  describe('_onCreate', function() {
    const carer = new Carer();

    const name = 'test name';
    const email = 'test email';
    const _password = 'test password';

    carer.createEvent('Create', {
      name,
      email,
      _password
    });

    carer.applyEvents();

    it('should set the name', () => {
      assert.equal(carer.name, name);
    });

    it('should set the email', () => {
      assert.equal(carer.email, email);
    });

    it('should set the password', () => {
      assert.equal(carer._password, _password);
    });
  });
});
