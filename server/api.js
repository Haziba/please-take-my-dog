module.exports = function(app){
  var db = require('./db.js');

  var dbResponse = (req, res, dbActions, failureMessage) => {
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
  		.catch((err) => dbFailure(req, res, failureMessage, err));
  };

  var dbSuccess = (res, data) => {
  	res.send({success: true, data: data});
  };

  var dbFailure = (req, res, failureMessage, err) => {
  	console.log(failureMessage(req), err);
  	res.status(500).send({success: false, message: failureMessage(res)});
  };

  let respond = function(method, url, auth, response){
    app[method](url, (req, res) => {
      db.validateAuthTicket(req.cookies.auth).then((carer) => {
        auth(req, carer, (authed) => {
          if(authed){
            response(req, res);
            return;
          }
          res.status(403);
          res.send('Forbidden');
        });
      }).catch((err) => {
        console.log('Failed to auth route', err);
      });
    });
  }

  let authCheck = {
    loggedIn: (carer) => {
      if(!!carer){
        return true;
      }
      return false;
    },

    loggedInAs: (carer, carerId) => {
      if(!authCheck.loggedIn(carer))
        return false;
      if(carer.id != carerId)
        return false;
      return true;
    },
  }

  require('./api/dogs.js')(app, respond, dbResponse, authCheck, db);

  app.get('/api/carer/:carerId', (req, res) => dbResponse(req, res, {carer: db.get("carer", req.params.carerId)}, (req) => { "Failed to get carer `" + req.params.carerId + "`" }));

  app.post('/api/auth/check', (req, res) => dbResponse(req, res, db.validateAuthTicket(req.body.ticket), (req) => { "Failed to authenticate ticket `" + req.body.ticket + "`" }));

  app.post('/api/auth/login', (req, res) => dbResponse(req, res, db.validateAuthLogin(req.body), (req) => { "Failed to authenticate user `" + req.body.email + "`" }));

  app.post('/api/auth/register', (req, res) => {
  	db.isEmailAvailable(req.body.email)
  		.then(() => dbResponse(req, res, {carer: db.insert("carer", req.body)}, (req) => { "Failed to create account" }))
  		.catch((err) => dbFailure(req, res, "Email address in use", err));
  });

  app.get('*', (req, res) => res.render('index.html'));
};
