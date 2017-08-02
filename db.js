const fs = require('fs');

var connect = function(){
	const pg = require('pg');
	const connectionDetails = process.env.DATABASE_URL || {port: process.env.DATABASE_URL || 5432, database: "postgres", user: "postgres"};

	const client = new pg.Client(connectionDetails);
	
	client.connect().catch(function(err){ 
		console.log("Failed to connect", err); 
	});

	return client;
}

var setupVersion = function(client){
	const versionExists = client.query("SELECT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='version')")
		.then(function(result){ 
			if(result.rows[0].exists){
				client.query("SELECT number FROM version").then(function(result){
					doUpdates(result.rows[0].number);
				})
				.catch(function(err){ console.log("Failed to get version number", err); });
			} else {
				client.query("CREATE TABLE version(number int)")
					.then(function(){
						client.query("INSERT INTO version(number) VALUES(0)")
							.then(function(){
								doUpdates(0);
							})
							.catch(function(err){ console.log("Failed to insert into version table", err); });
					})
					.catch(function(err){ console.log("Failed to create version table", err); });
			}
		})
		.catch(function(err){ console.log("Err", err); });
}

var doUpdates = function(currentVersion){
	console.log("Current DB Version", currentVersion);

	fs.readdir('./dbupdates', function(err, items){
		var updatesToDo = items.map(function(item){
			var versionNum = parseInt(item.split('_')[0]);
			return { versionNum: versionNum, fileName: item };
		}).filter((x) => x.versionNum > currentVersion);

		if(updatesToDo.length > 0)
			doUpdate(updatesToDo);
	});
}

var doUpdate = function(updatesToDo){
	var update = updatesToDo[0];

	fs.readFile('./dbupdates/' + update.fileName, function(err, data){
		client.query(data.toString())
			.then(function(){
				client.query("UPDATE version SET number=" + update.versionNum).then(function(result){
					console.log("Successfully applied update " + update.fileName);

					if(updatesToDo.length > 1){
						doUpdate(updatesToDo.splice(1));
					}
				}).catch(function(err){
					console.log("Failed to apply update " + update.fileName, err);
				});
			}).catch(function(err){
				console.log("Failed to apply update " + update.fileName, err); 
			});
	});
}

var client = connect();
setupVersion(client);

module.exports = {
	all: function(table){
		return new Promise(function(success, failure){
			client.query("select * from " + table).then(function(data){
				success(data.rows);
			});
		});
	},

	get: function(table, id){
		return new Promise(function(success, failure){
			client.query("select * from " + table + " where id=" + id).then(function(data){
				success(data.rows[0]);
			});
		});
	}
};
