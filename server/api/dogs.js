module.exports = function(app, respond, dbResponse, authCheck, db){
  app.get('/api/dogs', (req, res) => dbResponse(req, res, {dogs: db.all("dog")}, (req) => { "Failed to get dogs" }));

  app.get('/api/dogs/quicklist', (req, res) => dbResponse(req, res, {all: db.all("dog")}, (req) => { "Failed to get quicklist dogs" }));

  app.get('/api/dogs/:carerId', (req, res) => dbResponse(req, res, {dogs: db.allForParent("dog", "carer", req.params.carerId)}, (req) => { "Failed to get dogs for carer `" + req.params.carerId + "`" }));

  app.get('/api/dog/:dogId', (req, res) => dbResponse(req, res, {dog: db.get("dog", req.params.dogId), carer: db.getByChild("carer", "dog", req.params.dogId)}, (req) => { "Failed to get dog `" + req.params.dogId + "`" }));

  respond('put', '/api/dog/:dogId', (req, carer, callback) => {
    authCheck.isDogOwner(carer, req.params.dogId).then(callback);
  }, (req, res) => dbResponse(req, res, db.update("dog", req.params.dogId, req.body.dog), (req) => "Failed to update dog `" + req.params.dogId + "`"));

  respond('delete', '/api/dog/:dogId', (req, carer, callback) => {
    authCheck.isDogOwner(carer, req.params.dogId).then(callback);
  }, (req, res) => dbResponse(req, res, db.delete("dog", (req) => { req.params.dogId }), (req) => { "Failed to delete dog `" + req.params.dogId + "`"}));

  respond('post', '/api/dogs/add', (req, carer, callback) => {
    callback(authCheck.loggedIn(carer) && req.body.carerid == carer.id)
  }, (req, res) => dbResponse(req, res, {dog: db.insert('dog', req.body)}, (req) => { "Failed to insert dog `" + req.body + "`" }));

  app.get('/api/dog/:dogId/transfer', (req, res) => dbResponse(req, res, {dog: db.get("dog", req.params.dogId), carers: db.all("carer")}, (req) => { "Failed to get dog `" + req.params.dogId + "` and all carers" }));

  app.get('/api/dogs/:carerId/transfers', (req, res) => dbResponse(req, res, {transfers: db.allFiltered("dog", {transfercarerid: req.params.carerId}, (req) => { "Failed to get transfers `" + req.params.carerId + "`" })}));
}
