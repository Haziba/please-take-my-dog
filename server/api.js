const passwordHash = require('password-hash');
const randomstring = require('randomstring');
const all = require('promise-all');
const db = require('./db.js');
const Dog = require('./entities/dog.js');

module.exports = function(app){
  var apiCall = {
    db: (req, res, dbActions, failureMessage) => {
      let data, promises = [];

      if(typeof(dbActions) == 'function'){
        promises.push(dbActions());
      } else if(Promise.resolve(dbActions) == dbActions){
        promises.push(dbActions);
      } else {
        data = dbActions;

        for(var action in dbActions){
          promises.push(dbActions[action]);
        }

        for(let d in data) {
          (function(d){
            (typeof(data[d]) == "function" ? data[d]() : data[d]).then((resp) => { data[d] = resp })
          })(d);
        }
      }

    	Promise.all(promises)
        .then((resp) => apiCall.success(res, data ? data : resp[0]))
    		.catch((err) => apiCall.failure(req, res, failureMessage, err));
    },

    success: (res, data) => {
  	  res.send({success: true, data: data});
    },

    failure: (req, res, failureMessage, err) => {
  	  console.log(failureMessage(req), err);
  	  res.status(500).send({success: false, message: failureMessage(req)});
    }
  };

  let respond = function(method, url, auth, response){
    app[method](url, (req, res) => {
      db.validateAuthTicket(req.universalCookies.get('dog_auth')).then((carer) => {
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

    isDogOwner: (carer, dogId) => {
      return new Promise((success, failure) => {
        Dog.load(dogId).then((dog) => {
	  success(authCheck.loggedInAs(carer, dog.carerid));
        }).catch((err) => {
          failure(err);
        });
      });
    }
  }

  require('./api/dogs.js')(app, respond, apiCall, authCheck);
  require('./api/requests.js')(app, respond, apiCall, authCheck);
  require('./api/carers.js')(app, respond, apiCall, authCheck);

  app.post('/api/auth/check', (req, res) => apiCall.db(req, res, db.validateAuthTicket(req.body.ticket), (req) => { return "Failed to authenticate ticket `" + req.body.ticket + "`" }));

  app.post('/api/auth/login', (req, res) => apiCall.db(req, res, db.validateAuthLogin(req.body), (req) => { return "Failed to authenticate user `" + req.body.email + "`" }));

  app.post('/api/auth/register', (req, res) => {
  	db.isEmailAvailable(req.body.email)
  		.then(() => {
			req.body.pass = passwordHash.generate(req.body.pass);
      req.body.authtoken = randomstring.generate(50);
			return apiCall.db(req, res, {carer: db.insert("carer", req.body)}, (req) => { return "Failed to create account" })
		})
  		.catch((err) => apiCall.failure(req, res, (req) => { return "Email address in use"; }, err));
  });

  app.get('*', (req, res) => res.render('index.html'));
};
