const Entity = require('./entity.js');

const Dog = class Dog extends Entity {
  constructor(props = {}){
    super(props);

    var data = props.data || {};
    this.carerid = data.carerid;
    this.name = data.name;
    this.breed = data.breed;
    this.location = data.location;
    this.size = data.size;
    this.images = data.images || [];
    //todo: Timeline should be it's own thing
    //this.timeline = props.timeline;
    //todo: This should be moved into it's own "transfer" object
    this.transfercarerid = data.transfercarerid;
    this.carerhistory = data.carerhistory || [];

    this.applyEvents();
  }

  Create(carerId, name, breed, size, images){
    //todo: Replace with actual validation
    if(!carerId || !name || !breed || !size){
      return false;
    }

    this.createEvent("Create", {name: name, breed: breed, size: size, images: images});
    this.createEvent("NewCarer", {carerId: carerId});

    return true;
  }

  _onCreate(body){
    this.name = body.name;
    this.breed = body.breed;
    this.size = body.size;
    this.images = body.images;
  }

  _onNewCarer(body){
    this.carerid = body.carerId;
    this.carerhistory.push({carerId: body.carerId, on: body.on});
  }

  Update(name, breed, size, images){
    if(!name || !breed || !size){
      return false;
    }

    this.createEvent("Update", {name: name, breed: breed, size: size, images: images});

    return true;
  }

  _onUpdate(body){
    this.name = body.name;
    this.breed = body.breed;
    this.size = body.size;
    this.images = body.images;
  }

  Delete(){
    this.createEvent("Delete");

    return true;
  }

  _onDelete(body){
    this.deleted = true;
  }

  static new(carerId, name, breed, size, images){
    let dog = new Dog();

    dog.Create(carerId, name, breed, size, images);

    return dog;
  }
};

Entity._classes['Dog'] = Dog;

module.exports = Dog;
