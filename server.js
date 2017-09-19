var app = require('./server/app.js')();
var api = require('./server/api.js')(app);

// start the server
var server = app.listen(process.env.PORT || 3001, function() {
	console.log('\nServer ready on port %d\n', server.address().port);
});
