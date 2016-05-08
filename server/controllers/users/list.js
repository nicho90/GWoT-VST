var pg = require('pg');
var jwt = require('jsonwebtoken');
var secret = require('./../../config/secret');
var db_settings = require('../../server.js').db_settings;

// LIST
exports.request = function(req, res){

    // TODO:
    // - only admin
    // - order DESC or ASC

	// Create URL
	var url = "postgres://" + db_settings.user + ":" + db_settings.password + "@" + db_settings.host + ":" + db_settings.port + "/" + db_settings.database_name;

	// Connect to Database
	pg.connect(url, function(err, client, done) {
		if(err) {
			console.error('Error fetching client from pool', err);
		} else {

			// Database Query
            client.query('SELECT * FROM Users ORDER BY username;', function(err, result) {
                done();

                if(err) {
                    return console.error('error running query', err);
                } else {

                    // Send Result
                    res.status(200).send(result.rows);
                }
            });
		}
	});

};
