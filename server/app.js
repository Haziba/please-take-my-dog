var express = require('express');
var bodyParser = require('body-parser');
var cookiesMiddleware = require('universal-cookie-express');
var nunjucks = require('nunjucks');
var less = require('less-middleware');
var babelify = require('babelify');
var browserify = require('browserify-middleware');
var config = require('../client/config');

module.exports = function(bus, db){
  var app = express();
  app.use(cookiesMiddleware());

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  nunjucks.configure('server/templates/views', {
      express: app
  });

  app.use(less('public'));
  app.use(express.static('public'));

  app.get('/js/' + config.common.bundle, browserify(config.common.packages, {
  	cache: true,
  	precompile: true
  }));

  app.use('/js', browserify('./client/scripts', {
  	external: config.common.packages,
  	transform: [babelify.configure({
  		plugins: ['object-assign']
  	})]
  }));

  return app;
}
