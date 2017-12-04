const mock = require('mock-require');

const db = {
  upsertEntity: function(){
  },

  insert: function(table, obj){
    return new Promise((success, failure) => {
      if (!db.data) {
        db.data = {};
      }
      if(!db.data[table]){
        db.data[table] = [];
      }
      db.data[table].push(obj);
      success();
    });
  },

  get: function(table, id){
    return new Promise((success, failure) => {
      if (db.data && db.data[table] && db.data[table][id.uuid]) {
        success(db.data[table][id.uuid]);
      }
      failure();
    });
  },

  allFiltered: function(table, filter){
    return new Promise((success, failure) => {
      if(db.data && db.data[table])
        success(db.data[table].filter(o => o.uuid == filter.uuid));
      else
        success([]);
    });
  },

  upsertEntity: function(entity){
    return new Promise((success, failure) => {
      if(!db.data){
        db.data = {};
      }
      if(!db.data['entity']){
        db.data['entity'] = {};
      }
      db.data['entity'][entity.uuid] = entity;
    });
  }
};

mock('../../src/server/db.js', db);

module.exports = db;