const db = require('../db.js');

module.exports = function(app, respond, apiCall, authCheck){
  app.get('/api/carer/:carerId', (req, res) => apiCall.db(req, res, () => {
    return new Promise((success, failure) => {
      db.allForParent("dog", "carer", req.params.carerId).then((dogs) => {
        db.allFiltered("dog_request", {dogId: dogs.map((dog) => dog.id)}).then((requests) => {
          all({
            carer: db.get("carer", req.params.carerId),
            dogs: dogs,
            transfers: db.allFiltered("dog", {transfercarerid: req.params.carerId}),
            requests: requests,
            requestCarers: db.allFiltered("carer", {id: requests.map((request) => request.carerid)}),
          }).then(success);
        })
      });
    });
  }, (req) => { return "Failed to get carer `" + req.params.carerId + "`" }));

  app.get('/api/carer/', (req, res) => apiCall.db(req, res, {
    transfers: db.allFiltered("dog", {transfercarerid: req.params.carerId}, (req) => { "Failed to get transfers `" + req.params.carerId + "`" }),
    requests: () => {
      return new Promise((success, failure) => {
        success([]);
      });
    }
  }));

  respond('put', '/api/carer/:carerId', (req, carer, callback) => {
    callback(authCheck.loggedInAs(carer, req.params.carerId));
  }, (req, res) => apiCall.db(req, res, db.update("carer", req.params.carerId, req.body.carer), (req) => "Failed to update carer `" + req.params.carerId + "`"));
}
