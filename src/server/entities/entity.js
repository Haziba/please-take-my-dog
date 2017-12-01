const eventBus = require('./eventBus.js');
const db = require('../db.js');
const uuid = require('uuid/v1');

const Entity = class Entity {
  constructor(props = {}){
    this.uuid = props.uuid || uuid();
    this._events = props.events || [];
    this._totalEventsApplied = props.totaleventsapplied || 0;
  }

  createEvent(type, body){
    let event = { uuid: this.uuid, type: type, body: body }

    db.insert("event", event);

    this._events.push(event);
  }

  applyEvents(){
    for(let i = this._totalEventsApplied; i < this._events.length; i++){
      this.applyEvent(this._events[i]);
      this._totalEventsApplied++;
    }
  }

  commitEvents(){
    for(let i = this._totalEventsApplied; i < this._events.length; i++){
      this.applyEvent(this._events[i]);
      this._totalEventsApplied++;

      eventBus.pub(this.constructor.name, this, this._events[i].type, this._events[i].body);
    }
  }

  applyEvent(event){
    this[`_on${event.type}`](event.body || {});
  }

  save(){
    var saveable = {};

    this.commitEvents();

    saveable.uuid = this.uuid;
    saveable.totalEventsApplied = this._totalEventsApplied;
    saveable.entityType = this.constructor.name;

    saveable.data = {};

    for(let key of this.dataKeys())
      saveable.data[key] = this[key];

    return db.upsertEntity(saveable);
  }

  forClient(){
    var obj = {id: this.uuid};

    for(let key of this.dataKeys())
      if(key[0] != '_')
        obj[key] = this[key];

    return obj;
  }

  dataKeys(){
    let keys = [];
    for(let key in this){
      if(key == "uuid" || key == "totalEventsApplied" || key == "events"){
        continue;
      }
      keys.push(key);
    }
    return keys;
  }

  static load(uuid){
    let entityClass = this;

    //todo: Handle failure
    return new Promise((success, failure) => {
      db.get("entity", {uuid: uuid}).then((row) => {
        entityClass.rowToEntity(row).then(success);
      });
    });
  }

  static loadAll(){
    let entityClass = this;

    return new Promise((success, failure) => {
      db.allFiltered("entity", {entityType: entityClass.name}).then((rows) => {
        rows = rows.filter(e => !e.deleted);
        entityClass.rowsToEntities(rows).then(success);
      })
    });
  }

  static loadBy(filters){
    let entityClass = this;

    return new Promise((success, failure) => {
      entityClass.loadAll().then((rows => {
        entityClass.rowsToEntities(rows).then(entities => {
          var filteredEntities = entities.filter(e => {
            for(var key in filters){
              if(e[key] != filters[key]){
                return false;
              }
            }
            return true;
          });

          success(filteredEntities);
        });
      }));
    });
  }

  static loadMany(ids){
    let entityClass = this;

    return new Promise((success, failure) => {
      entityClass.loadAll().then((rows => {
        entityClass.rowsToEntities(rows).then(entities => {
          var filteredEntities = entities.filter(e => ids.indexOf(e.uuid) >= 0);

          success(filteredEntities);
        });
      }));
    });
  }

  static rowsToEntities(rows){
    let entityClass = this;
    return Promise.all(rows.map(row => entityClass.rowToEntity(row)));
  }

  static rowToEntity(row){
    let entityClass = Entity._classes[this.name];

    return new Promise((success, failure) => {
      db.allFiltered("event", {uuid: row.uuid}).then(events => {
        row.events = events;
        success(new entityClass(row));
      });
    });
  }

  static promiseForClient(promise){
    return new Promise((success, failure) => {
      promise.then((entities) => {
        if(Array.isArray(entities)){
          success(entities.map(e => e.forClient()));
        } else {
          success(entities.forClient());
        }
      });
    });
  }
}

Entity._classes = {};

module.exports = Entity;
