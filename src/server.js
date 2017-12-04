var db  = require('./server/db.js');
var app = require('./server/app.js')(db);
var api = require('./server/api.js')(app, db);

// start the server
const server = app.listen(process.env.PORT || 3001, function() {
	console.log('\nServer ready on port %d\n', server.address().port);
});

module.exports = server;
