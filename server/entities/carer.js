const Entity = require('./entity.js');

const passwordHash = require('password-hash');
const randomstring = require('randomstring');

const Carer = class Carer extends Entity {
  constructor(props = {}){
    super(props);

    var data = props.data || {};
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.authToken = data.authToken;
    this.avatar = data.avatar;
    this.dogs = data.dogs || [];

    this.applyEvents();
  }

  Create(name, email, password){
    //todo: Replace with actual validation
    if(!name || !email || !password){
      return false;
    }

    password = passwordHash.generate(password);

    this.createEvent("Create", {name, email, password});

    this.RefreshAuthToken();

    return true;
  }

  _onCreate(body){
    this.name = body.name;
    this.email = body.email;
    this.password = body.password;
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
    if(!passwordHash.verify(password, this.password))
      return false;

    this.createEvent("LogIn");

    this.RefreshAuthToken();

    return true;
  }

  _onLogIn(body){
  }

  RefreshAuthToken(){
    let authToken = randomstring.generate(50);

    this.createEvent("RefreshAuthToken", {authToken});

    return true;
  }

  _onRefreshAuthToken(body){
    this.authToken = body.authToken;
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
    this.createEvent("Delete", {on: new Date()});

    return true;
  }

  _onDelete(body){
    this.deleted = true;
    this.deletedOn = body.on;
  }

  static new(name, email, password){
    let carer = new Carer();

    carer.Create(name, email, password);

    return carer;
  }
}

Entity._classes['Carer'] = Carer;

module.exports = Carer;
