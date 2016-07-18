var pg = require('pg');
var types = require('pg').types;
types.setTypeParser(1700, 'text', parseFloat);
var _ = require('underscore');
var jwt = require('jsonwebtoken');
var secret = require('./../../config/secret');
var db = require('./../../config/db');
var db_settings = require('../../server.js').db_settings;
var errors = require('./../../config/errors');


// LIST
exports.request = function(req, res){

	// Create URL
	var url = "postgres://" + db_settings.user + ":" + db_settings.password + "@" + db_settings.host + ":" + db_settings.port + "/" + db_settings.database_name;

	// Connect to Database
	pg.connect(url, function(err, client, done) {
		if(err) {
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
						if(username === req.params.username || username === db.admin) {

							// Database Query
			                client.query("SELECT * FROM Users WHERE username=$1;", [
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

										// Database Query
										var query = "SELECT " +
												"subscriptions.subscription_id, " +
												"subscriptions.created, " +
												"subscriptions.updated, " +
												"subscriptions.creator, " +
												"subscriptions.sensor_id, " +
												"sensors.device_id, " +
												"sensors.description AS sensor_description, " +
												"subscriptions.threshold_id, " +
												"thresholds.description AS threshold_description, " +
												"thresholds.category AS threshold_category " +
											"FROM Subscriptions subscriptions JOIN Sensors sensors ON subscriptions.sensor_id=sensors.sensor_id " +
											"JOIN Thresholds thresholds ON subscriptions.threshold_id=thresholds.threshold_id "+
											"WHERE subscriptions.creator=$1 " +
											"ORDER BY created DESC;";

										client.query(query, [
											req.params.username
										], function(err, result) {
											done();

											if(err) {
												res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
												return console.error(errors.database.error_2.message, err);
											} else {

												// Send Result
												res.status(200).send(result.rows);
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
