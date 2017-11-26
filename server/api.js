const all = require('promise-all');
const db = require('./db.js');

const Dog = require('./entities/dog.js');
const Carer = require('./entities/carer.js');

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
      let authTicket = req.universalCookies.get('dog_auth');
      let [carerId, token] = authTicket.split(':');
      Carer.load(carerId).then((carer) => {
        auth(req, carer, (authed) => {
          if(authed){
            response(req, res);
            return;
          }
          res.status(403);
          res.send('Forbidden');
        })
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
      if(carer.uuid != carerId)
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

  app.post('/api/auth/check', (req, res) => {
    let [carerId, token] = req.body.ticket.split(':');

    Carer.load(carerId).then((carer) => {
      if(carer.authToken == token)
        apiCall.success(res, carer.forClient());
      else
        apiCall.failure(req, res, (req) => { return "Failed to authenticate ticket `" + req.body.ticket + "`" });
    })
  });

  app.post('/api/auth/login', (req, res) => {
    // untested
    Carer.loadBy({email: req.body.email}).then((carers) => {
console.log("carers?", carers);
      let carer = carers[0];

      if(!carer){
        apiCall.failure(req, res, (req) => { return "Could not find user for email `" + req.body.email + "`"});
        return;
      }

      if(carer.LogIn(req.body.password)){
        carer.save()
          .then(() => apiCall.success(res, carer.forClient()))
          .catch((err) => apiCall.failure(req, res, (req) => { return "Failed to authenticate user `" + req.body.email + "`"}));
      } else {
        apiCall.failure(req, res, (req) => { return "Failed to authenticate user `" + req.body.email + "`" });
      }
    });
  });

  app.post('/api/auth/register', (req, res) => {
    Carer.loadAll().then((carers) => {
      if(carers.find((carer) => carer.email == req.body.email)){
        apiCall.failure(req, res, (req) => { return "Email address in use"; });
        return;
      }

      let carer = Carer.new(req.body.name, req.body.email, req.body.password);

      carer.save()
        .then(() => apiCall.success(res, {carer: carer.forClient()}))
        .catch((err) => apiCall.failure(req, res, (req) => { "Failed to create carer `" + req.body + "`"}, err));
    });
  });

  app.get('*', (req, res) => res.render('index.html'));
};
