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

var dbResponse = (res, promise, failureMessage) => {
	promise	.then((data) => dbSuccess(res, data))
		.catch((err) => dbFailure(res, failureMessage, err));
};

var dbSuccess = (res, data) => {
	res.send({success: true, data: data});
};

var dbFailure = (res, failureMessage, err) => {
	console.log(failureMessage, err);
	res.status(500).send({success: false, message: failureMessage});
};

app.get('/api/dogs', (req, res) => dbResponse(res, db.all("dogs"), "Failed to get dogs"));

app.get('/api/dogs/:carerId', (req, res) => dbResponse(res, db.getByParent("dogs", "carer", req.params.carerId), "Failed to get dogs for carer `" + req.params.carerId + "`"));

app.get('/api/dog/:dogId', (req, res) => dbResponse(res, db.get("dogs", req.params.dogId), "Failed to get dog `" + req.params.dogId + "`"));

app.post('/api/dogs/add', (req, res) => dbResponse(res, db.insert('dogs', req.body), "Failed to insert dog `" + req.body + "`"));

app.post('/api/auth/check', (req, res) => dbResponse(res, db.validateAuthTicket(req.body.ticket), "Failed to authenticate ticket `" + req.body.ticket + "`"));

app.post('/api/auth/login', (req, res) => dbResponse(res, db.validateAuthLogin(req.body), "Failed to authenticate user `" + rep.body.email + "`"));

app.post('/api/auth/register', (req, res) => {
	db.isEmailAvailable(req.body.email)
		.then(() => dbResponse(res, db.insert("carer", req.body), "Failed to create account"))
		.catch((err) => dbFailure(res, "Email address in use", err));
});

// start the server
var server = app.listen(process.env.PORT || 3001, function() {
	console.log('\nServer ready on port %d\n', server.address().port);
});
