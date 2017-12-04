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
    const subs = [];
    if(eventBus._subs && eventBus._subs[entityType] && eventBus._subs[entityType][event]){
      for(let sub of eventBus._subs[entityType][event]){
        subs.push(sub(entity, data));
      }
    }
    return Promise.all(subs);
  },

  reset: () => {
    eventBus._subs = {};
  }
};

module.exports = eventBus;