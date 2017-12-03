const eventBus = require('../../eventBus.js');

const Dog = require('../../entities/dog.js');
const Carer = require('../../entities/carer.js');

eventBus.sub(Dog.name, 'NewCarer', (dog, body) => {
  console.log("Sub fire");
  Carer.load(body.carerId).then(carer => {
    console.log("load", carer);
    carer.AddDog(dog.uuid);

    carer.save();
  });
});
