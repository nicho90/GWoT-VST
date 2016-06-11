var pg = require('pg');
var types = require('pg').types;
types.setTypeParser(1700, 'text', parseFloat);
var _ = require('underscore');
var jwt = require('jsonwebtoken');
var secret = require('./../../config/secret');
var db_settings = require('../../server.js').db_settings;
var errors = require('./../../config/errors');
var verifier = require('./../../config/verifier');

var Ajv = require('ajv');
var schema = require('./../../models/sensor');
var ajv = Ajv({"format": "full"});
var validate = ajv.compile(schema);


// POST
exports.request = function(req, res){

	// Authentication
	jwt.verify(req.headers.token, secret.key, function(err, decoded) {
		if (err) {
			res.status(errors.authentication.error_2.code).send(_.extend(errors.authentication.error_2, { err: err }));
			return console.error(errors.authentication.error_2.message);
        } else {

			// Further token valiation
			var validation = verifier(decoded, req.params.username);
			if(!validation.success) {
				res.status(errors.authentication.error_3.code).send(_.extend(errors.authentication.error_3, { message: validation.message }));
				return console.error(errors.authentication.error_3.message);
			} else {

				// Schema Validation
				var valid = validate(req.body);
				if (!valid) {
					res.status(errors.schema.error_1.code).send(_.extend(errors.schema.error_1, {
						err: validate.errors[0].dataPath + ": " + validate.errors[0].message
					}));
					return console.error(validate.errors[0].dataPath + ": " + validate.errors[0].message);
				} else {

					// Create URL
					var url = "postgres://" + db_settings.user + ":" + db_settings.password + "@" + db_settings.host + ":" + db_settings.port + "/" + db_settings.database_name;

					// Connect to Database
					pg.connect(url, function(err, client, done) {
						if(err) {
				            res.status(errors.database.error_1.code).send(errors.database.error_1);
							return console.error(errors.database.error_1.message, err);
						} else {

							var query = "INSERT INTO Sensors (" +
								"created, " +
								"updated, " +
								"created_by, " +
								"device_id, " +
								"description, " +
								"private, " +
								"water_body_id, " +
								"coordinates, " +
								"sensor_height, " +
								"crossing_height, " +
								"default_frequency, " +
								"danger_frequency, " +
								"increased_frequency, " +
								"online_status " +
							") VALUES (" + "now(), now(), $1, $2, $3, $4, $5, 'POINT(" + req.body.lat + " " + req.body.lng + ")', $6, $7, $8, $9, $10, 'false', 'false');";

							// Database Query
							client.query(query, [
								req.params.username,
								req.body.device_id,
								req.body.description,
								req.body.private,
								req.body.water_body_id,
								req.body.sensor_height,
								req.body.crossing_height,
								req.body.threshold_value,
								req.body.default_frequency,
								req.body.danger_frequency
							], function(err, result) {
								done();

								if(err) {
									res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
				                    return console.error(errors.database.error_2.message, err);
								} else {

									var query = "SELECT " +
										"sensors.sensor_id, " +
										"sensors.device_id, " +
										"sensors.description ," +
										"sensors.private, " +
										"sensors.online_status, " +
										"sensors.water_body_id, " +
										"water_bodies.name AS water_body_name, " +
										"sensors.sensor_height, " +
										"'CENTIMETER' AS sensor_height_unit, " +
										"sensors.crossing_height, " +
										"'CENTIMETER' AS crossing_height_unit, " +
										"sensors.default_frequency, " +
										"'MILLISECONDS' AS default_frequency_unit, " +
										"sensors.danger_frequency, " +
										"'MILLISECONDS' AS danger_frequency_unit, " +
										"sensors.increased_frequency, " +
										"sensors.threshold_value, " +
										"'CENTIMETER' AS threshold_value_unit, " +
										"ST_X(sensors.coordinates::geometry) AS lng, " +
										"ST_Y(sensors.coordinates::geometry) AS lat, " +
										"sensors.created, " +
										"sensors.updated " +
										"FROM Sensors sensors JOIN Water_Bodies water_bodies ON sensors.water_body_id=water_bodies.water_body_id " +
										"WHERE created_by=$1 ORDER BY created DESC;";

									// Database Query
									client.query(query, [
										req.params.username
									], function(err, result) {
										done();

					                    if(err) {
											res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
						                    return console.error(errors.database.error_2.message, err);
					                    } else {

											// Send Result
											res.status(201).send(result.rows[0]);
										}
									});
								}
							});
						}
					});
				}
			}
		}
	});
};
