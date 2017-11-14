const all = require('promise-all');
const db = require('../db.js');

module.exports = function(app, respond, apiCall, authCheck){
  app.get('/api/request/:requestId', (req, res) => apiCall.db(req, res, () => {
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
  }, (req, res) => apiCall.db(req, res, {request: db.insert('dog_request', req.body)}, (req) => { "Failed to insert request `" + req.body + "`"}));
}
