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

app.get('/api/dogs', function(req, res){
	db.all("dogs").then(function(dogs){
		res.send(dogs);
	}).catch(function(err){
		console.log("Failed to get dogs", err);
		res.status(500).send("Failed to get dogs");
	});
});

app.get('/api/dogs/:carerId', function(req, res){
	db.getByParent("dogs", "carer", req.params.carerId).then(function(dogs){
		res.send(dogs);
	}).catch(function(err){
		console.log("Failed to get dogs for carer `" + req.params.carerId + "`");
		res.status(500).send("Failed to get dogs for carer `" + req.params.carerId + "`");
	});
});

app.get('/api/dog/:dogId', function(req, res){
	db.get("dogs", req.params.dogId).then(function(dog){
		res.send(dog);
	}).catch(function(err){
		console.log("Failed to get dog `" + req.params.dogId + "`", err);
		res.status(500).send("Failed to get dog `" + req.params.dogId + "`");
	});
});

app.post('/api/auth/check', function(req, res){
	var ticket = req.body.ticket;

	db.validateAuthTicket(ticket).then(function(carer){
		res.send({success: true, carer: carer});
	}).catch(function(){
		res.send({success: false});
	});
});

app.post('/api/auth/login', function(req, res){
	console.log("get req body", req.body);
	db.validateAuthLogin(req.body).then(function(carer){
		res.send({success: true, carer: carer});
	}).catch(function(){
		res.send({success: false});
	});
});

app.get('*', function(req, res) {
	// this route will respond to all requests with the contents of your index
	// template. Doing this allows react-router to render the view in the app.
    res.render('index.html');
});

// start the server
var server = app.listen(process.env.PORT || 3001, function() {
	console.log('\nServer ready on port %d\n', server.address().port);
});
