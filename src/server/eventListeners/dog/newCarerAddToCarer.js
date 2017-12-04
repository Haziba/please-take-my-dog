const eventBus = require('../../eventBus.js');

const Dog = require('../../entities/dog.js');
const Carer = require('../../entities/carer.js');

eventBus.sub(Dog.name, 'NewCarer', (dog, body) => {
  return new Promise((success, failure) => {
    Carer.load(body.carerId).then(carer => {
      carer.AddDog(dog.uuid);

      carer.save();

      success();
    });
  });
});
