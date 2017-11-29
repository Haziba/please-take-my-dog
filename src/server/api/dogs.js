const db = require('../db.js');
const Dog = require('../entities/dog.js');

module.exports = function(app, respond, apiCall, authCheck){
  app.get('/api/dogs', (req, res) => apiCall.db(req, res, {dogs: Dog.promiseForClient(Dog.loadAll())}, (req) => { "Failed to get dogs" }));

  app.get('/api/dogs/quicklist', (req, res) => apiCall.db(req, res, {all: Dog.promiseForClient(Dog.loadAll())}, (req) => { "Failed to get quicklist dogs" }));

  app.get('/api/dog/:dogId', (req, res) => apiCall.db(req, res, {dog: Dog.promiseForClient(Dog.load(req.params.dogId)), carer: db.getByChild("carer", "dog", req.params.dogId)}, (req) => { "Failed to get dog `" + req.params.dogId + "`" }));

  respond('put', '/api/dog/:dogId', (req, carer, callback) => {
    authCheck.isDogOwner(carer, req.params.dogId).then(callback);
  }, (req, res) => {
    Dog.load(req.params.dogId).then((dog) => {
      dog.Update(req.body.dog.name, req.body.dog.breed, req.body.dog.size, req.body.dog.images);

      dog.save()
        .then(() => apiCall.success(res, dog.forClient()))
        .catch((err) => apiCall.failure(req, res, (req) => { "Failed to update dog `" + req.body + "`" }, err));
    });
  });

  respond('delete', '/api/dog/:dogId', (req, carer, callback) => {
    authCheck.isDogOwner(carer, req.params.dogId).then(callback);
  }, (req, res) => {
    Dog.load(req.params.dogId).then((dog) => {
      dog.Delete();

      dog.save()
        .then(() => apiCall.success(res, dog.forClient()))
        .catch((err) => apiCall.failure(req, res, (req) => { "Failed to delete dog `" + req.params.dogId + "`" }, err));
    });
  });

  respond('post', '/api/dogs/add', (req, carer, callback) => {
    callback(authCheck.loggedInAs(carer, req.body.carerid));
  }, (req, res) => {
    var dog = Dog.new(req.body.carerid, req.body.name, req.body.breed, req.body.size, req.body.images);

    dog.save()
      .then(() => apiCall.success(res, dog))
      .catch((err) => apiCall.failure(req, res, (req) => { "Failed to create dog `" + req.body + "`"}, err));
  });

  app.get('/api/dog/:dogId/transfer', (req, res) => apiCall.db(req, res, {dog: db.get("dog", req.params.dogId), carers: db.all("carer")}, (req) => { "Failed to get dog `" + req.params.dogId + "` and all carers" }));
}
