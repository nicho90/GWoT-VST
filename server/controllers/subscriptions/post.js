var pg = require('pg');
var types = require('pg').types;
types.setTypeParser(1700, 'text', parseFloat);
var _ = require('underscore');
var jwt = require('jsonwebtoken');
var secret = require('./../../config/secret');
var db = require('./../../config/db');
var db_settings = require('../../server.js').db_settings;
var errors = require('./../../config/errors');

var Ajv = require('ajv');
var schema = require('./../../models/threshold');
var ajv = Ajv({"format": "full"});
var validate = ajv.compile(schema);


// POST
exports.request = function(req, res){

	// TODO: Schema-Validation
	// and check if Sensor was public or authenticated user was creator of private sensor or admin

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
										client.query("INSERT INTO Subscriptions (created, updated, creator, sensor_id, threshold_id) VALUES (now(), now(), $1, $2, $3);", [
											req.params.username,
											req.body.sensor_id,
											req.body.threshold_id
										], function(err, result) {
											done();

											if(err) {
												res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
							                    return console.error(errors.database.error_2.message, err);
											} else {

												var query = "SELECT " +
														"subscriptions.subscription_id, " +
														"subscriptions.created, " +
														"subscriptions.updated, " +
														"subscriptions.creator, " +
														"subscriptions.sensor_id, " +
														"sensors.description AS sensor_description, " +
														"subscriptions.threshold_id, " +
														"thresholds.description AS threshold_description, " +
														"thresholds.category AS threshold_category " +
													"FROM Subscriptions subscriptions JOIN Sensors sensors ON subscriptions.sensor_id=sensors.sensor_id " +
													"JOIN Thresholds thresholds ON subscriptions.threshold_id=thresholds.threshold_id "+
													"WHERE subscriptions.creator=$1 " +
													"ORDER BY created DESC;";

												// Database Query
												client.query(query, [
													req.params.username
												], function(err, result) {
													done();

								                    if(err) {
														res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
									                    return console.error(errors.database.error_2.message, err);
								                    } else {

														// Check if Subscription exists
								                        if(result.rows.length === 0) {
															res.status(errors.query.error_5.code).send(errors.query.error_5);
															return console.error(errors.query.error_5.message);
								                        } else {

															// Send Result
															res.status(201).send(result.rows[0]);
														}
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
