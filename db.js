const fs = require('fs');

var connect = () => {
	const pg = require('pg');
	const connectionDetails = process.env.DATABASE_URL || {host: '127.0.0.1', port: process.env.DATABASE_URL || 5432, database: "postgres", user: "postgres"};

	const client = new pg.Client(connectionDetails);
	
	client.connect().catch((err) => console.log("Failed to connect", err)); 

	return client;
}

var setupVersion = (client) => {
	const versionExists = client.query("SELECT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='version')")
		.then((result) => { 
			if(result.rows[0].exists){
				client.query("SELECT number FROM version")
					.then((result) => doUpdates(result.rows[0].number))
					.catch((err) => console.log("Failed to get version number", err));
			} else {
				client.query("CREATE TABLE version(number int)")
					.then(() => {
						client.query("INSERT INTO version(number) VALUES(0)")
							.then(() => doUpdates(0))
							.catch((err) => console.log("Failed to insert into version table", err));
					})
					.catch((err) => console.log("Failed to create version table", err));
			}
		})
		.catch((err) => console.log("Err", err));
}

var doUpdates = (currentVersion) => {
	console.log("Current DB Version", currentVersion);

	fs.readdir('./dbupdates', (err, items) => {
		let updatesToDo = items.map((item) => {
			let versionNum = parseInt(item.split('_')[0]);
			return { versionNum: versionNum, fileName: item };
		}).filter((x) => x.versionNum > currentVersion);

		if(updatesToDo.length > 0)
			doUpdate(updatesToDo);
	});
}

var doUpdate = function(updatesToDo){
	let update = updatesToDo[0];

	fs.readFile('./dbupdates/' + update.fileName, function(err, data){
		client.query(data.toString())
			.then(() => {
				client.query("UPDATE version SET number=" + update.versionNum)
					.then((result) => {
						console.log("Successfully applied update " + update.fileName);

						if(updatesToDo.length > 1)
							doUpdate(updatesToDo.splice(1));
					}).catch((err) => console.log("Failed to apply update " + update.fileName, err));
			}).catch((err) => console.log("Failed to apply update " + update.fileName, err));
	});
}

var parseRow = (row) => {
	for(let prop in row){
		switch(typeof row[prop]){
			case "string":
				row[prop] = row[prop].trim();
				break;
		}
	}

	return row;
}

var client = connect();
setupVersion(client);

module.exports = {
	all: (table) => {
		return new Promise((success, failure) => {
			client.query("select * from " + table)
				.then((data) => {
					let rows = data.rows.map((row) => parseRow(row));

					success(rows);
				});
		});
	},

	get: (table, id) => {
		return new Promise((success, failure) => {
			client.query("select * from " + table + " where id=" + id)
				.then((data) => {
					let row = parseRow(data.rows[0]);

					success(row);
				});
		});
	},

	getByParent: (table, parent, parentId) => {
		return new Promise((success, failure) => {
			client.query("select * from " + table + " where " + parent + "id=" + parentId)
				.then((data) => {
					let rows = data.rows.map((row) => parseRow(row));

					success(rows);
				});
		});
	},

	insert: (table, obj) => {
		return new Promise((success, failure) => {
			let cols = [];
			let vals = [];
			
			for(let prop in obj){
				cols.push(prop);
				vals.push("'" + obj[prop] + "'");
			}

			client.query("insert into " + table + "(" + cols.join(",") + ") VALUES(" + vals.join(",") + ")")
				.then((data) => success(obj)).catch((err) => {
					console.log("Failed to insert " + table, err);
					failure();
				});
		});
	},

	isEmailAvailable: (email) => {
		return new Promise((success, failure) => {
			client.query("select * from carer where email='" + email + "'").then((data) => {
				if(data.rowCount == 0){
					success();
				} else {
					failure();
				}
			}).catch((err) => {
				console.log("Failed to check email availability `" + email + "`");
				failure();
			});
		});
	},

	validateAuthTicket: (authTicket) => {
		let authDetails = authTicket.split(':');

		return new Promise((success, failure) => {
			client.query("select * from carer where email='" + authDetails[0] + "' and pass='" + authDetails[1] + "'")
				.then((data) => {
					if(data.rowCount > 0){
						let row = parseRow(data.rows[0]);

						success(row);
					} else {
						failure();
					}
				}).catch((err) => {
					console.log("Failed to validate auth ticket", err);
					failure();
				});
		});
	},

	validateAuthLogin: (authDetails) => {
		return new Promise((success, failure) => {
			client.query("select * from carer where email='" + authDetails.email + "' and pass='" + authDetails.pass + "'")
				.then((data) => {
					if(data.rows.length > 0){
						let row = parseRow(data.rows[0]);

						success(row);
					} else {
						failure();
					}
				}).catch((err) => {
					console.log("Failed to validate auth login", err);
					failure();
				});
		});
	}
};
