const eventBus = {
  sub: (entityType, event, callback) => {
    if(!this._subs)
      this._subs = {};
    if(!this._subs[entityType])
      this._subs[entityType] = {};
    if(!this._subs[entityType][event])
      this._subs[entityType][event] = [];
    this._subs[entityType][event].push(callback);
  },

  pub: (entityType, entity, event, data) => {
    if(eventBus._subs && eventBus._subs[entityType] && eventBus._subs[entityType][event]){
      for(let sub of eventBus._subs[entityType][event]){
        sub(entity, data);
      }
    }
  }
};

module.exports = eventBus;