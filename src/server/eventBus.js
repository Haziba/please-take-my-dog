const eventBus = {
  sub: (entityType, event, callback) => {
    if(!eventBus._subs)
      eventBus._subs = {};
    if(!eventBus._subs[entityType])
      eventBus._subs[entityType] = {};
    if(!eventBus._subs[entityType][event])
      eventBus._subs[entityType][event] = [];
    eventBus._subs[entityType][event].push(callback);
  },

  pub: (entityType, entity, event, data) => {
    if(eventBus._subs && eventBus._subs[entityType] && eventBus._subs[entityType][event]){
      for(let sub of eventBus._subs[entityType][event]){
        sub(entity, data);
      }
    }
  },

  reset: () => {
    eventBus._subs = {};
  }
};

module.exports = eventBus;