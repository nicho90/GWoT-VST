var pg = require('pg');
var _ = require('underscore');
var jwt = require('jsonwebtoken');
var secret = require('./../../config/secret');
var db_settings = require('../../server.js').db_settings;
var errors = require('./../../config/errors');


// PUT
exports.request = function(req, res){

	// TODO: Schema-Validation

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
							client.query('SELECT (created, updated, username, password, email_address, first_name, last_name) FROM Users WHERE username=$1;', [
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

		                                // Prepare Query
		                                var query = "UPDATE Users SET " +
		                                    "updated=now(), " +
		                                    "username=($1), " +
		                                    "password=($2), " +
		                                    "email_address=($3), " +
		                                    "first_name=($4), " +
		                                    "last_name=($5) " +
		                                    "language=($6) " +
		                                    "WHERE username=($7);";

		                                // Database Query
		                                client.query(query, [
		                                    req.body.username,
		                                    req.body.password,
		                                    req.body.email_address,
		                                    req.body.first_name,
		                                    req.body.last_name,
		                                    req.body.language,
		                                    req.params.username
		                                ], function(err, result) {
		                                    done();

		                                    if(err) {
		                                        res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
		                                        return console.error(errors.database.error_2.message, err);
		                                    } else {

		                                        // Database Query
		                                        client.query('SELECT (created, updated, username, password, email_address, first_name, last_name) FROM Users WHERE username=$1;', [
		                                            req.body.username
		                                        ], function(err, result) {
		                                            done();

		                                            if(err) {
		                                                res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
		                                                return console.error(errors.database.error_2.message, err);
		                                            } else {

		                                                // Attach Access-Token
		                                                var user = result.rows[0];
		                                                user.authorization = req.headers.authorization;

		                                                // Send Result
		                                                res.status(200).send(user);
		                                            }
		                                        });
		                                    }
		                                });
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
