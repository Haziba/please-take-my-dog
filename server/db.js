const fs = require('fs');
const randomstring = require('randomstring');
const passwordHash = require('password-hash');

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

var valForSql = (val) => {
	//todo: Replace this hack
	if(typeof(val) == "string" && (val == "null" || val == '')){
		return "null";
	}

	return val;
}

var client = connect();
setupVersion(client);

var DB = {
	all: (table) => {
		return new Promise((success, failure) => {
			client.query(`select * from ${table} where deleted=false`)
				.then((data) => {
					let rows = data.rows.map((row) => parseRow(row));

					success(rows);
				}).catch((err) => {
					console.log("Failed to get all table=" + table, err);
					failure("Server error");
				});
		});
	},

	get: (table, id) => {
		return new Promise((success, failure) => {
			client.query("select * from " + table + " where id=" + id)
				.then((data) => {
					let row = parseRow(data.rows[0]);

					success(row);
				}).catch((err) => {
					console.log("Failed to get table=" + table + ", id=" + id, err);
					failure("Server error");
				});
		});
	},

	allFiltered: (table, filter) => {
		var filters = "";

		for(var prop in filter){
			if(filters != "")
				filters += " and ";

			if(Array.isArray(filter[prop])){
				if(filter[prop].length == 0){
					return Promise.resolve([]);
				}

				filters += prop + " in ('" + filter[prop].join("','") + "')";
			} else {
				filters += prop + "='" + filter[prop] + "'";
			}
		}

		return new Promise((success, failure) => {
			client.query("select * from " + table + " where " + filters)
				.then((data) => {
					let rows = data.rows.map((row) => parseRow(row));
					
					success(rows);
				}).catch((err) => {
					console.log("Failed to get table=" + table + ", filters=`" + filters + "`", err);
					failure("Server error");
				});
		});
	},

	getByChild: (table, child, childId) => {
		return new Promise((success, failure) => {
			client.query("select t.* from " + table + " t inner join " + child + " c on c." + table + "id=t.id")
				.then((data) => {
					let row = parseRow(data.rows[0]);

					success(row);
				}).catch((err) => {
					console.log("Failed to get by child table=" + table + ", child=" + child + ", childId=" + childId, err);
					failure("Server error");
				});
		});
	},

	allForParent: (table, parent, parentId) => {
		return new Promise((success, failure) => {
			client.query(`select * from ${table} where ${parent}id=${parentId} and deleted=false`)
				.then((data) => {
					let rows = data.rows.map((row) => parseRow(row));

					success(rows);
				}).catch((err) => {
					console.log("Failed to get by parent table=" + table + ", parent=" + parent + ", parentId=", parentId);
					failure("Server error");
				});
		});
	},

	insert: (table, obj) => {
		return new Promise((success, failure) => {
			let cols = [];
			let vals = [];
			let placeholders = "";

			for(let prop in obj){
				cols.push(prop);
				vals.push(valForSql(obj[prop]));
				placeholders += (placeholders.length > 0 ? ',' : '') + `$${vals.length}`;
			}
			
			client.query("insert into " + table + "(" + cols.join(",") + ") VALUES(" + placeholders + ")", vals)
				.then((data) => success(obj)).catch((err) => {
					console.log("Failed to insert " + table, err);
					failure("Insert failed");
				}).catch((err) => {
					console.log("Failed to insert into " + table);
					failure("Server error");
				});
		});
	},

	update: (table, objId, obj) => {
		return new Promise((success, failure) => {
			let sets = [];

			for(let prop in obj){
				sets.push(`${prop}=${valForSql(obj[prop])}`);
			}

			client.query("update " + table + " set " + sets.join(', ') + " where id=" + objId)
				.then((data) => success(obj)).catch((err) => {
					console.log("Failed to update " + table, err);
					failure("Update failed");
				}).catch((err) => {
					console.log("Failed to update " + table);
					failure("Server error");
				});
		});
	},

	delete: (table, objId) => {
		return new Promise((success, failure) => {
			client.query(`update ${table} set deleted=true where id='${objId}'`)
				.then(() => success()).catch((err) => {
					console.log(`Failed to delete ${table}`, err);
					failure("Deletion failed");
				}).catch((err) => {
					console.log(`Failed to delete ${table}`);
					failure("Server error");
				})
		});
	},

	isEmailAvailable: (email) => {
		return new Promise((success, failure) => {
			client.query("select * from carer where email='" + email + "'").then((data) => {
				if(data.rowCount == 0){
					success();
				} else {
					failure("Email is not available");
				}
			}).catch((err) => {
				console.log("Failed to check email availability `" + email + "`");
				failure("Server error");
			});
		});
	},

	validateAuthTicket: (authTicket) => {
		return new Promise((success, failure) => {
			if(!authTicket || authTicket.indexOf(':') < 0){
				failure("Invalid auth ticket");
				return;
			}

			let authDetails = authTicket.split(':');

			client.query("select * from carer where email='" + authDetails[0] + "' and authtoken='" + authDetails[1] + "'")
				.then((data) => {
					if(data.rowCount > 0){
						let row = parseRow(data.rows[0]);

						row.pass = undefined;

						success(row);
					} else {
						failure("Failed to validate auth ticket");
					}
				}).catch((err) => {
					console.log("Failed to validate auth ticket authDetails", err);
					failure("Server error");
				});
		});
	},

	validateAuthLogin: (authDetails) => {
		return new Promise((success, failure) => {
			client.query("select * from carer where email='" + authDetails.email + "'")
				.then((data) => {
					if(data.rows.length > 0 && passwordHash.verify(authDetails.pass, data.rows[0].pass)){
						let row = parseRow(data.rows[0]);

						var oldAuthToken = row.authtoken;
						row.authtoken = randomstring.generate(50);

						DB.update('carer', row.id, row).then((result) => {
							row.pass = undefined;

							success(row);
						}).catch((err) => {
							console.log("Failed to set authtoken email='" + authDetails.email + "'", err);
							failure("Server error");
						});
					} else {
						failure("No user was found with that email and password");
					}
				}).catch((err) => {
					console.log("Failed to validate auth login email='" + authDetails.email + "'", err);
					failure("Server error");
				});
		});
	}
};

module.exports = DB;
