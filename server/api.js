module.exports = function(app){
  var db = require('./db.js');

  var dbResponse = (res, dbActions, failureMessage) => {
    let data, promises = [];

    if(Promise.resolve(dbActions) == dbActions){
      promises.push(dbActions);
    } else {
      data = dbActions;

      for(var action in dbActions){
        promises.push(dbActions[action]);
      }

      for(let d in data) {
        (function(d){
          data[d].then((resp) => { data[d] = resp })
        })(d);
      }
    }

  	Promise.all(promises)
      .then((resp) => dbSuccess(res, data ? data : resp[0]))
  		.catch((err) => dbFailure(res, failureMessage, err));
  };

  var dbSuccess = (res, data) => {
  	res.send({success: true, data: data});
  };

  var dbFailure = (res, failureMessage, err) => {
  	console.log(failureMessage, err);
  	res.status(500).send({success: false, message: failureMessage});
  };

  app.get('/api/dogs', (req, res) => dbResponse(res, {dogs: db.all("dog")}, "Failed to get dogs"));

  app.get('/api/dogs/quicklist', (req, res) => dbResponse(res, {all: db.all("dog")}, "Failed to get quicklist dogs"));

  app.get('/api/dogs/:carerId', (req, res) => dbResponse(res, {dogs: db.allForParent("dog", "carer", req.params.carerId)}, "Failed to get dogs for carer `" + req.params.carerId + "`"));

  app.get('/api/dog/:dogId', (req, res) => dbResponse(res, {dog: db.get("dog", req.params.dogId), carer: db.getByChild("carer", "dog", req.params.dogId)}, "Failed to get dog `" + req.params.dogId + "`"));

  app.put('/api/dog/:dogId', (req, res) => dbResponse(res, db.update("dog", req.params.dogId, req.body.dog)));

  app.delete('/api/dog/:dogId', (req, res) => dbResponse(res, db.delete("dog", req.params.dogId)));

  app.post('/api/dogs/add', (req, res) => dbResponse(res, {dog: db.insert('dog', req.body)}, "Failed to insert dog `" + req.body + "`"));

  app.post('/api/dog/:dogId/update', (req, res) => dbResponse(res, {dog: db.update('dog', req.params.dogId, req.body.dog)}, "Failed to update dog `" + req.params.dogId + "`, `" + req.body + "`"));

  app.get('/api/dog/:dogId/transfer', (req, res) => dbResponse(res, {dog: db.get("dog", req.params.dogId), carers: db.all("carer")}, "Failed to get dog `" + req.params.dogId + "` and all carers"));

  app.get('/api/dogs/:carerId/transfers', (req, res) => dbResponse(res, {transfers: db.allFiltered("dog", {transfercarerid: req.params.carerId})}))

  app.get('/api/carer/:carerId', (req, res) => dbResponse(res, {carer: db.get("carer", req.params.carerId)}, "Failed to get carer `" + req.params.carerId + "`"));

  app.post('/api/auth/check', (req, res) => dbResponse(res, db.validateAuthTicket(req.body.ticket), "Failed to authenticate ticket `" + req.body.ticket + "`"));

  app.post('/api/auth/login', (req, res) => dbResponse(res, db.validateAuthLogin(req.body), "Failed to authenticate user `" + req.body.email + "`"));

  app.post('/api/auth/register', (req, res) => {
  	db.isEmailAvailable(req.body.email)
  		.then(() => dbResponse(res, {carer: db.insert("carer", req.body)}, "Failed to create account"))
  		.catch((err) => dbFailure(res, "Email address in use", err));
  });

  app.get('*', (req, res) => res.render('index.html'));
};
