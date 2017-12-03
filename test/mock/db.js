const mock = require('mock-require');

const db = {
  upsertEntity: function(){
  },

  insert: function(){
  },
};

mock('../../src/server/db.js', db);

module.exports = db;