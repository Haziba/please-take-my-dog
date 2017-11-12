const all = require('promise-all');

module.exports = function(app, respond, dbResponse, authCheck, db){
  app.get('/api/request/:requestId', (req, res) => dbResponse(req, res, () => {
    return new Promise((success, failure) => {
      db.get("dog_request", req.params.requestId).then((request) => {
        all({
          carer: db.get("carer", request.carerid),
          dog: db.get("dog", request.dogid),
          request: request
        }).then(success);
      });
    });
  }, (req) => { return "Failed to get carer `" + req.params.carerId + "`" }));

  respond('post', '/api/dog/:dogId/request', (req, carer, callback) => {
    callback(authCheck.loggedIn(carer));
  }, (req, res) => dbResponse(req, res, {request: db.insert('dog_request', req.body)}, (req) => { "Failed to insert request `" + req.body + "`"}));
}
