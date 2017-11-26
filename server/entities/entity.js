const eventBus = require('./eventBus.js');
const db = require('../db.js');
const uuid = require('uuid/v1');

module.exports = class Entity {
  constructor(props = {}){
    this.uuid = props.uuid || uuid();
    this.events = props.events || [];
    this.totalEventsApplied = props.totaleventsapplied || 0;
  }

  createEvent(type, body){
    let event = { uuid: this.uuid, type: type, body: body }

    db.insert("event", event);

    this.events.push(event);
  }

  commitEvents(){
    for(let i = this.totalEventsApplied; i < this.events.length; i++){
      this.applyEvent(this.events[i]);
      this.totalEventsApplied++;
    }
  }

  applyEvent(event){
    this[`_on${event.type}`](event.body || {});
  }

  save(){
    var saveable = {};

    this.commitEvents();

    saveable.uuid = this.uuid;
    saveable.totalEventsApplied = this.totalEventsApplied;
    saveable.entityType = this.constructor.name;

    saveable.data = {};

    for(let key of this.dataKeys())
      saveable.data[key] = this[key];

    return db.upsertEntity(saveable);
  }

  forClient(){
    var obj = {id: this.uuid};

    for(let key of this.dataKeys())
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

  static loadEntity(entityClass, uuid){
    //todo: Handle failure
    return new Promise((success, failure) => {
      db.get("entity", {uuid: uuid}).then((entity) => {
        db.allFiltered("event", {uuid: uuid}).then((events) => {
          entity.events = events;
          success(new entityClass(entity));
        });
      });
    });
  }

  static loadAll(entityClass){
    return new Promise((success, failure) => {
      db.allFiltered("entity", {entityType: entityClass.name}).then((entities) => {
        entities = entities.filter(e => !e.deleted);

        let loadEvents = [];
        for(let entity of entities){
          loadEvents.push(db.allFiltered("event", {uuid: entity.uuid}));
        }

        Promise.all(loadEvents).then((events) => {
          for(let eventList of events){
            let uuid = eventList[0].uuid;
            entities.find(e => e.uuid == uuid).events = eventList;
          }

          success(entities.map(e => new entityClass(e)));
        });
      })
    });
  }

  static loadBy(entityClass, filters){
    return new Promise((success, failure) => {
      Entity.loadAll(entityClass).then((entities => {
        entities = entities.map(e => new entityClass(e));

        var filteredEntities = entities.filter(e => {
          for(var key in filters){
            if(e[key] != filters[key]){
              return false;
            }
          }
          return true;
        });

        success(filteredEntities);
      }));
    });
  }

  static loadMany(entityClass, ids){
    return new Promise((success, failure) => {
      Entity.loadAll(entityClass).then((entities => {
        entities = entities.map(e => new entityClass(e));

        var filteredEntities = entities.filter(e => ids.indexOf(e.id) >= 0);

        success(filteredEntities);
      }));
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
