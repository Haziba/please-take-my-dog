const Entity = require('./entity.js');

const passwordHash = require('password-hash');
const randomstring = require('randomstring');

const Carer = class Carer extends Entity {
  constructor(props = {}){
    super(props);

    var data = props.data || {};
    this.name = data.name;
    this.email = data.email;
    this._password = data._password;
    this._authToken = data._authToken;
    this.avatar = data.avatar;
    this.dogs = data.dogs || [];

    this.applyEvents();
  }

  Create(name, email, password){
    //todo: Replace with actual validation
    if(!name || !email || !password){
      return false;
    }

    const _password = passwordHash.generate(password);

    this.createEvent("Create", {name, email, _password});

    this.RefreshAuthToken();

    return true;
  }

  _onCreate(body){
    this.name = body.name;
    this.email = body.email;
    this._password = body._password;
  }

  AddDog(dogId){
    if(!dogId){
      return false;
    }

    this.createEvent("AddDog", {dogId, on: new Date()});

    return true;
  }

  _onAddDog(body){
    this.dogs.push(body.dogId);
  }

  LogIn(password){
    if(!passwordHash.verify(password, this._password))
      return false;

    this.createEvent("LogIn");

    this.RefreshAuthToken();

    return true;
  }

  _onLogIn(body){
  }

  RefreshAuthToken(){
    let _authToken = randomstring.generate(50);

    this.createEvent("RefreshAuthToken", {_authToken});

    return true;
  }

  _onRefreshAuthToken(body){
    this._authToken = body._authToken;
  }

  Update(name, avatar){
    if(!name){
      return false;
    }

    this.createEvent("Update", {name, avatar});

    return true;
  }

  _onUpdate(body){
    this.name = body.name;
    this.avatar = body.avatar;
  }

  Delete(){
    this.createEvent("Delete");

    return true;
  }

  _onDelete(body){
    this.deleted = true;
  }

  static new(name, email, password){
    let carer = new Carer();

    carer.Create(name, email, password);

    return carer;
  }
}

Entity._classes['Carer'] = Carer;

module.exports = Carer;
