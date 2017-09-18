var express = require('express');
var babelify = require('babelify');
var browserify = require('browserify-middleware');
var less = require('less-middleware');
var nunjucks = require('nunjucks');
var bodyParser = require('body-parser');
var config = require('./client/config');

// initialise express
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// use nunjucks to process view templates in express
nunjucks.configure('server/templates/views', {
    express: app
});

// less will automatically compile matching requests for .css files
app.use(less('public'));
// public assets are served before any dynamic requests
app.use(express.static('public'));

// common packages are precompiled on server start and cached
app.get('/js/' + config.common.bundle, browserify(config.common.packages, {
	cache: true,
	precompile: true
}));

// any file in /client/scripts will automatically be browserified,
// excluding common packages.
app.use('/js', browserify('./client/scripts', {
	external: config.common.packages,
	transform: [babelify.configure({
		plugins: ['object-assign']
	})]
}));

/*
	set up any additional server routes (api endpoints, static pages, etc.)
	here before the catch-all route for index.html below.
*/

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

app.delete('/api/dog/:dogId', (req, res) => dbResponse(res, db.delete("dog", req.params.dogId)));

app.post('/api/dogs/add', (req, res) => dbResponse(res, {dog: db.insert('dog', req.body)}, "Failed to insert dog `" + req.body + "`"));

app.post('/api/dog/:dogId/update', (req, res) => dbResponse(res, {dog: db.update('dog', req.params.dogId, req.body.dog)}, "Failed to update dog `" + req.params.dogId + "`, `" + req.body + "`"));

app.get('/api/carer/:carerId', (req, res) => dbResponse(res, {carer: db.get("carer", req.params.carerId)}, "Failed to get carer `" + req.params.carerId + "`"));

app.post('/api/auth/check', (req, res) => dbResponse(res, db.validateAuthTicket(req.body.ticket), "Failed to authenticate ticket `" + req.body.ticket + "`"));

app.post('/api/auth/login', (req, res) => dbResponse(res, db.validateAuthLogin(req.body), "Failed to authenticate user `" + req.body.email + "`"));

app.post('/api/auth/register', (req, res) => {
	db.isEmailAvailable(req.body.email)
		.then(() => dbResponse(res, {carer: db.insert("carer", req.body)}, "Failed to create account"))
		.catch((err) => dbFailure(res, "Email address in use", err));
});

app.get('*', (req, res) => res.render('index.html'));

// start the server
var server = app.listen(process.env.PORT || 3001, function() {
	console.log('\nServer ready on port %d\n', server.address().port);
});
