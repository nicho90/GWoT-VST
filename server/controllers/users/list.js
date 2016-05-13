var pg = require('pg');
var jwt = require('jsonwebtoken');
var secret = require('./../../config/secret');
var verifier = require('./../../config/verifier');
var db_settings = require('../../server.js').db_settings;

// LIST
exports.request = function(req, res){

	// Create URL
	var url = "postgres://" + db_settings.user + ":" + db_settings.password + "@" + db_settings.host + ":" + db_settings.port + "/" + db_settings.database_name;

	// Decode Token
	jwt.verify(req.headers.token, secret.key, function(err, decoded) {
		if (err) {
			res.status(401).json({
				message: 'Failed to authenticate with this token'
			});
        } else {

			// Further token valiation for Admin
			var validation = verifier(decoded, db_settings.admin);
			console.log(validation);

			if(!validation.success) {
				res.status(401).json({
					message: validation.message
				});
			} else {

				// Prepare Order
				var order;
				switch(req.query.sort) {
				    case "asc": {
							order = "ASC";
						}
				        break;
				    case "desc": {
							order = "DESC";
						}
				        break;
				    default: {
						order = "ASC";
					}
				}

				// Connect to Database
				pg.connect(url, function(err, client, done) {
					if(err) {
						console.error('Error fetching client from pool', err);
					} else {

						// Database Query
			            client.query('SELECT * FROM Users ORDER BY username ' + order + ';', function(err, result) {
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
			}
		}
	});
};
