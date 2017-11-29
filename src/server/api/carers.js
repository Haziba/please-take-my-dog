const all = require('promise-all');
const db = require('../db.js');

const Carer = require('../entities/carer.js');
const Dog = require('../entities/dog.js');

module.exports = function(app, respond, apiCall, authCheck){
  app.get('/api/carer/:carerId', (req, res) => {
    Carer.promiseForClient(Carer.load(req.params.carerId)).then((carer) => {
      Dog.promiseForClient(Dog.loadMany(carer.dogs)).then((dogs) => {
        all({
          carer,
          dogs,
          transfers: [],
          requests: [],
          requestCarers: {}
        }).then((results) => apiCall.success(res, results));
      });
    });
  });

  respond('put', '/api/carer/:carerId', (req, carer, callback) => {
    callback(authCheck.loggedInAs(carer, req.params.carerId));
  }, (req, res) => {
    Carer.load(req.params.carerId).then((carer) => {
      carer.Update(req.body.carer.name, req.body.carer.avatar);

      carer.save()
        .then(() => apiCall.success(res, carer.forClient()))
        .catch((err) => apiCall.failure(req, res, (req) => { "Failed to update carer `" + req.body + "`"}, err));
    })
  });
}
