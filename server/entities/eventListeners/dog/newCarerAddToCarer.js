const eventBus = require('../../eventBus.js');

const Dog = require('../../dog.js');
const Carer = require('../../carer.js');

eventBus.sub(Dog.name, 'NewCarer', (dog, body) => {
  Carer.load(body.carerId).then(carer => {
    carer.AddDog(dog.uuid);

    carer.save();
    console.log("Carer saved", carer);
  });
});
