const mock = require('mock-require');

mock('../src/server/db.js', {
  upsertEntity: function(){
  },

  insert: function(){
  }
});
