var pg = require('pg');
var types = require('pg').types;
types.setTypeParser(1700, 'text', parseFloat);
var _ = require('underscore');
var jwt = require('jsonwebtoken');
var db = require('./../../config/db');
var secret = require('./../../config/secret');
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
			var query;

			// Check if User was authenticated
			if(!req.headers.authorization || req.headers.authorization === ""){

				// SELECT ALL PUBLIC SENSORS
				query = "SELECT " +
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
					"WHERE sensors.private=false " +
					"ORDER BY sensors.sensor_id ASC;";

				// Database Query
				client.query(query, function(err, result) {
					done();

					if(err) {
						res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
						return console.error(errors.database.error_2.message, err);
					} else {

						// Send Result
						res.status(200).send(result.rows);
					}
				});

			} else {

				// Decode Token
				jwt.verify(req.headers.authorization, secret.key, function(err, decoded) {
					if (err) {
						res.status(errors.authentication.error_2.code).send(errors.authentication.error_2);
						return console.error(errors.authentication.error_2.message);
			        }

					// Get username from authenticated user
					var username = decoded.username;

					// Check if authenticated user is admin
					if(username === db.admin) {

						// SELECT ALL SENSORS
						query = "SELECT " +
							"sensors.sensor_id, " +
							"sensors.device_id, " +
							"sensors.description ," +
							"sensors.private, " +
							"sensors.online_status, " +
							"sensors.creator, " +
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
						"ORDER BY sensors.sensor_id ASC;";

						// Database Query
						client.query(query, function(err, result) {
							done();

							if(err) {
								res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
								return console.error(errors.database.error_2.message, err);
							} else {

								// Send Result
								res.status(200).send(result.rows);
							}
						});

					} else {

						// SELECT ALL PUBLIC SENSORS AND ALL CREATED SENSORS OF THE USER
						query = "" +
							"SELECT DISTINCT " +
								"sensor_id, " +
								"device_id, " +
								"description ," +
								"private, " +
								"online_status, " +
								"water_body_id, " +
								"water_body_name, " +
								"sensor_height, " +
								"sensor_height_unit, " +
								"crossing_height, " +
								"crossing_height_unit, " +
								"default_frequency, " +
								"default_frequency_unit, " +
								"danger_frequency, " +
								"danger_frequency_unit, " +
								"increased_frequency, " +
								"threshold_value, " +
								"threshold_value_unit, " +
								"lng, " +
								"lat, " +
								"created, " +
								"updated " +
							"FROM " +
							"(" +
								"SELECT " +
									"sensors.creator, " +
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
								"WHERE sensors.private=false " +
							"UNION ALL " +
								"SELECT " +
									"sensors.creator, " +
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
								"WHERE sensors.creator=$1" +
							") AS Sensors " +
							"ORDER BY sensor_id ASC;";

						// Database Query
						client.query(query, [
							username
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
				});
			}
		}
	});
};
