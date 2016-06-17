var pg = require('pg');
var _ = require('underscore');
var jwt = require('jsonwebtoken');
var secret = require('./../../config/secret');
var db_settings = require('../../server.js').db_settings;
var errors = require('./../../config/errors');


// GET
exports.request = function(req, res){

	// Create URL
	var url = "postgres://" + db_settings.user + ":" + db_settings.password + "@" + db_settings.host + ":" + db_settings.port + "/" + db_settings.database_name;

	// Connect to Database
	pg.connect(url, function(err, client, done) {
		if (err) {
			res.status(errors.database.error_1.code).send(errors.database.error_1);
			return console.error(errors.database.error_1.message, err);
		} else {

			// Check if User was authenticated
			if(!req.headers.authorization || req.headers.authorization === ""){
				res.status(errors.authentication.error_3.code).send(errors.authentication.error_3);
				return console.error(errors.authentication.error_3.message);
			} else {

				// Decode Token
				jwt.verify(req.headers.authorization, secret.key, function(err, decoded) {
					if (err) {
						res.status(errors.authentication.error_2.code).send(errors.authentication.error_2);
						return console.error(errors.authentication.error_2.message);
					} else {

						// Get username from authenticated user
						var username = decoded.username;

						// Check if authenticated user is the right user or admin
						if(username === req.params.username || username === db.admin) {

							// Database Query
							client.query('SELECT created, updated, username, password, email_address, first_name, last_name FROM Users WHERE username=$1;', [
								req.params.username
							], function(err, result) {
								done();

								if(err) {
									res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
									return console.error(errors.database.error_2.message, err);
								} else {

									// Check if User exists
									if(result.rows.length === 0) {
										res.status(errors.query.error_1.code).send(errors.query.error_1);
										return console.error(errors.query.error_1.message);
									} else {

										// Prepare result
			                            var user = result.rows[0];

										// Refresh and attach Access-Token
										user.token = jwt.sign({username: user.username, password: user.password}, secret.key, {
											expiresIn: '1d' // Default: 1 day
										});

										// Send result
										res.status(200).send(user);
									}
								}
							});

						} else {
							res.status(errors.authentication.error_2.code).send(errors.authentication.error_2);
							return console.error(errors.authentication.error_2.message);
						}
					}
				});
			}
		}
	});
};
