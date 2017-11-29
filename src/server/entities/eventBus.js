//todo: Build event bus
module.exports = {
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
    if(this._subs && this._subs[entityType] && this._subs[entityType][event]){
      for(let sub of this._subs[entityType][event]){
        sub(entity, data);
      }
    }
  }
};
