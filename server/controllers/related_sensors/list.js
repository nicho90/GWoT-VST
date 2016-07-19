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

		    // Database Query
			client.query("SELECT * FROM Sensors WHERE sensor_id=$1;", [
				req.params.sensor_id
			], function(err, result) {
				done();

				if(err) {
					res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
					return console.error(errors.database.error_2.message, err);
				} else {

					// Check if Sensor exists
					if(result.rows.length === 0) {
						res.status(errors.query.error_2.code).send(errors.query.error_2);
						return console.error(errors.query.error_2.message);
					} else {

                        // Get Sensor from results
						var sensor = result.rows[0];

                        // Check if User was authenticated
                        if(!req.headers.authorization || req.headers.authorization === ""){

                            // Check if Sensor was public
                            if(!sensor.private) {

                                // Get only related sensors, which are public
                                var query = "SELECT " +
                                    "related_sensors.sensor_id, " +
                                    "ST_Distance(related_sensors.coordinates, main_sensor.coordinates) AS distance, " +
                                    "'METER' AS distance_unit, " +
                                    "related_sensors.device_id, " +
                                    "related_sensors.description, " +
                                    "related_sensors.private, " +
                                    "related_sensors.online_status, " +
                                    "related_sensors.water_body_id, " +
									"water_bodies.water_body_type, " +
                                    "water_bodies.name AS water_body_name, " +
                                    "related_sensors.sensor_height, " +
                                    "'CENTIMETER' AS sensor_height_unit, " +
                                    "related_sensors.crossing_height, " +
                                    "'CENTIMETER' AS crossing_height_unit, " +
                                    "related_sensors.default_frequency, " +
                                    "'MILLISECONDS' AS default_frequency_unit, " +
                                    "related_sensors.danger_frequency, " +
                                    "'MILLISECONDS' AS danger_frequency_unit, " +
                                    "related_sensors.increased_frequency, " +
                                    "related_sensors.triggered_threshold, " +
                                    "related_sensors.triggered_weather, " +
                                    "related_sensors.threshold_value, " +
                                    "'CENTIMETER' AS threshold_value_unit, " +
                                    "ST_X(related_sensors.coordinates::geometry) AS lng, " +
                                    "ST_Y(related_sensors.coordinates::geometry) AS lat, " +
									"related_sensors.crossing_type, " +
									"related_sensors.seasonal, " +
									"related_sensors.wet_season_begin, " +
									"related_sensors.wet_season_end, " +
									"related_sensors.dry_season_begin, " +
									"related_sensors.dry_season_end " +
                                "FROM " +
                                    "(" +
										"SELECT " +
											"sensor_id, " +
											"water_body_id, " +
											"coordinates " +
                                        "FROM Sensors " +
                                        "WHERE sensor_id=$1" +
									") AS main_sensor, " +
                                    "Sensors related_sensors JOIN Water_Bodies water_bodies ON related_sensors.water_body_id=water_bodies.water_body_id " +
                                "WHERE related_sensors.sensor_id != main_sensor.sensor_id " +
									"AND related_sensors.private=false " +
									"AND related_sensors.water_body_id = main_sensor.water_body_id " +
                                "ORDER BY distance ASC;";

                                // Database query
                                client.query(query, [
                                    req.params.sensor_id
                                ], function(err, result) {
                                    done();

                                    if (err) {
                                        res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
                                        return console.error(errors.database.error_2.message, err);
                                    } else {

                                        // Send Result
                                        res.status(200).send(result.rows);
                                    }
                                });

                            } else {
                                res.status(errors.query.error_2.code).send(errors.query.error_2);
        						return console.error(errors.query.error_2.message);
                            }

                        } else {

                            // Decode Token
                            jwt.verify(req.headers.authorization, secret.key, function(err, decoded) {
                                if (err) {
                                    res.status(errors.authentication.error_2.code).send(errors.authentication.error_2);
                                    return console.error(errors.authentication.error_2.message);
                                } else {

                                    // Get username from authenticated user
                                    var username = decoded.username;
                                    var query;

                                    // Check if Sensor was public
                                    if(!sensor.private) {

                                        // Check if authenticated user is admin
                                        if(username === db.admin) {

                                            // Get all related sensors
                                            query = "SELECT " +
                                                "related_sensors.sensor_id, " +
                                                "ST_Distance(related_sensors.coordinates, main_sensor.coordinates) AS distance, " +
                                                "'METER' AS distance_unit, " +
                                                "related_sensors.device_id, " +
                                                "related_sensors.description, " +
                                                "related_sensors.private, " +
                                                "related_sensors.online_status, " +
                                                "related_sensors.water_body_id, " +
												"water_bodies.water_body_type, " +
                                                "water_bodies.name AS water_body_name, " +
                                                "related_sensors.sensor_height, " +
                                                "'CENTIMETER' AS sensor_height_unit, " +
                                                "related_sensors.crossing_height, " +
                                                "'CENTIMETER' AS crossing_height_unit, " +
                                                "related_sensors.default_frequency, " +
                                                "'MILLISECONDS' AS default_frequency_unit, " +
                                                "related_sensors.danger_frequency, " +
                                                "'MILLISECONDS' AS danger_frequency_unit, " +
                                                "related_sensors.increased_frequency, " +
                                                "related_sensors.triggered_threshold, " +
                                                "related_sensors.triggered_weather, " +
                                                "related_sensors.threshold_value, " +
                                                "'CENTIMETER' AS threshold_value_unit, " +
                                                "ST_X(related_sensors.coordinates::geometry) AS lng, " +
                                                "ST_Y(related_sensors.coordinates::geometry) AS lat, " +
												"related_sensors.crossing_type, " +
												"related_sensors.seasonal, " +
												"related_sensors.wet_season_begin, " +
												"related_sensors.wet_season_end, " +
												"related_sensors.dry_season_begin, " +
												"related_sensors.dry_season_end " +
                                            "FROM " +
                                                "(" +
													"SELECT " +
														"sensor_id, " +
														"water_body_id, " +
														"coordinates " +
                                                    "FROM Sensors " +
                                                    "WHERE sensor_id=$1" +
												") AS main_sensor, " +
                                                "Sensors related_sensors JOIN Water_Bodies water_bodies ON related_sensors.water_body_id=water_bodies.water_body_id " +
                                            "WHERE related_sensors.sensor_id != main_sensor.sensor_id " +
												"AND related_sensors.water_body_id = main_sensor.water_body_id " +
                                            "ORDER BY distance ASC;";

                                        } else {

                                            // Get only related sensors, which are public or were created by the authenticated user
                                            query = "SELECT " +
                                                "related_sensors.sensor_id, " +
                                                "ST_Distance(related_sensors.coordinates, main_sensor.coordinates) AS distance, " +
                                                "'METER' AS distance_unit, " +
                                                "related_sensors.device_id, " +
                                                "related_sensors.description, " +
                                                "related_sensors.private, " +
                                                "related_sensors.online_status, " +
                                                "related_sensors.water_body_id, " +
												"water_bodies.water_body_type, " +
                                                "water_bodies.name AS water_body_name, " +
                                                "related_sensors.sensor_height, " +
                                                "'CENTIMETER' AS sensor_height_unit, " +
                                                "related_sensors.crossing_height, " +
                                                "'CENTIMETER' AS crossing_height_unit, " +
                                                "related_sensors.default_frequency, " +
                                                "'MILLISECONDS' AS default_frequency_unit, " +
                                                "related_sensors.danger_frequency, " +
                                                "'MILLISECONDS' AS danger_frequency_unit, " +
                                                "related_sensors.increased_frequency, " +
                                                "related_sensors.triggered_threshold, " +
                                                "related_sensors.triggered_weather, " +
                                                "related_sensors.threshold_value, " +
                                                "'CENTIMETER' AS threshold_value_unit, " +
                                                "ST_X(related_sensors.coordinates::geometry) AS lng, " +
                                                "ST_Y(related_sensors.coordinates::geometry) AS lat, " +
												"related_sensors.crossing_type, " +
												"related_sensors.seasonal, " +
												"related_sensors.wet_season_begin, " +
												"related_sensors.wet_season_end, " +
												"related_sensors.dry_season_begin, " +
												"related_sensors.dry_season_end " +
                                            "FROM " +
                                                "(" +
													"SELECT " +
														"sensor_id, " +
														"water_body_id, " +
														"coordinates " +
                                                    "FROM Sensors " +
                                                    "WHERE sensor_id=$1" +
												") AS main_sensor, " +
                                                "Sensors related_sensors JOIN Water_Bodies water_bodies ON related_sensors.water_body_id=water_bodies.water_body_id " +
                                            "WHERE related_sensors.sensor_id != main_sensor.sensor_id " +
												"AND (" +
													"related_sensors.private=false " +
													"OR (" +
														"related_sensors.private=true " +
														"AND related_sensors.creator=$2" +
													")" +
												") " +
												"AND related_sensors.water_body_id = main_sensor.water_body_id " +
                                            "ORDER BY distance ASC;";

                                        }

                                        // Database query
                                        client.query(query, [
                                            req.params.sensor_id,
                                            username
                                        ], function(err, result) {
                                            done();

                                            if (err) {
                                                res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
                                                return console.error(errors.database.error_2.message, err);
                                            } else {

                                                // Send Result
                                                res.status(200).send(result.rows);
                                            }
                                        });

                                    } else {

                                        // Check if authenticated user is admin
                                        if(username === db.admin) {

                                            // Get all related sensors
                                            query = "SELECT " +
                                                "related_sensors.sensor_id, " +
                                                "ST_Distance(related_sensors.coordinates, main_sensor.coordinates) AS distance, " +
                                                "'METER' AS distance_unit, " +
                                                "related_sensors.device_id, " +
                                                "related_sensors.description, " +
                                                "related_sensors.private, " +
                                                "related_sensors.online_status, " +
                                                "related_sensors.water_body_id, " +
												"water_bodies.water_body_type, " +
                                                "water_bodies.name AS water_body_name, " +
                                                "related_sensors.sensor_height, " +
                                                "'CENTIMETER' AS sensor_height_unit, " +
                                                "related_sensors.crossing_height, " +
                                                "'CENTIMETER' AS crossing_height_unit, " +
                                                "related_sensors.default_frequency, " +
                                                "'MILLISECONDS' AS default_frequency_unit, " +
                                                "related_sensors.danger_frequency, " +
                                                "'MILLISECONDS' AS danger_frequency_unit, " +
                                                "related_sensors.increased_frequency, " +
                                                "related_sensors.triggered_threshold, " +
                                                "related_sensors.triggered_weather, " +
                                                "related_sensors.threshold_value, " +
                                                "'CENTIMETER' AS threshold_value_unit, " +
                                                "ST_X(related_sensors.coordinates::geometry) AS lng, " +
                                                "ST_Y(related_sensors.coordinates::geometry) AS lat, " +
												"related_sensors.crossing_type, " +
												"related_sensors.seasonal, " +
												"related_sensors.wet_season_begin, " +
												"related_sensors.wet_season_end, " +
												"related_sensors.dry_season_begin, " +
												"related_sensors.dry_season_end " +
                                            "FROM " +
												"(" +
													"SELECT " +
														"sensor_id, " +
														"water_body_id, " +
														"coordinates " +
													"FROM Sensors " +
													"WHERE sensor_id=$1" +
												") AS main_sensor, " +
                                                "Sensors related_sensors JOIN Water_Bodies water_bodies ON related_sensors.water_body_id=water_bodies.water_body_id " +
                                            "WHERE related_sensors.sensor_id != main_sensor.sensor_id " +
											"AND related_sensors.water_body_id = main_sensor.water_body_id " +
                                            "ORDER BY distance ASC;";

                                            // Database query
                                            client.query(query, [
                                                req.params.sensor_id
                                            ], function(err, result) {
                                                done();

                                                if (err) {
                                                    res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
                                                    return console.error(errors.database.error_2.message, err);
                                                } else {

                                                    // Send Result
                                                    res.status(200).send(result.rows);
                                                }
                                            });

                                        } else {

                                            // Check if authenticated user was creator of private Sensor
                                            if(username === sensor.creator){

                                                // Get only related sensors, which are public or were created by the authenticated user
                                                query = "SELECT " +
                                                    "related_sensors.sensor_id, " +
                                                    "ST_Distance(related_sensors.coordinates, main_sensor.coordinates) AS distance, " +
                                                    "'METER' AS distance_unit, " +
                                                    "related_sensors.device_id, " +
                                                    "related_sensors.description, " +
                                                    "related_sensors.private, " +
                                                    "related_sensors.online_status, " +
                                                    "related_sensors.water_body_id, " +
													"water_bodies.water_body_type, " +
                                                    "water_bodies.name AS water_body_name, " +
                                                    "related_sensors.sensor_height, " +
                                                    "'CENTIMETER' AS sensor_height_unit, " +
                                                    "related_sensors.crossing_height, " +
                                                    "'CENTIMETER' AS crossing_height_unit, " +
                                                    "related_sensors.default_frequency, " +
                                                    "'MILLISECONDS' AS default_frequency_unit, " +
                                                    "related_sensors.danger_frequency, " +
                                                    "'MILLISECONDS' AS danger_frequency_unit, " +
                                                    "related_sensors.increased_frequency, " +
                                                    "related_sensors.triggered_threshold, " +
                                                    "related_sensors.triggered_weather, " +
                                                    "related_sensors.threshold_value, " +
                                                    "'CENTIMETER' AS threshold_value_unit, " +
                                                    "ST_X(related_sensors.coordinates::geometry) AS lng, " +
                                                    "ST_Y(related_sensors.coordinates::geometry) AS lat, " +
													"related_sensors.crossing_type, " +
													"related_sensors.seasonal, " +
													"related_sensors.wet_season_begin, " +
													"related_sensors.wet_season_end, " +
													"related_sensors.dry_season_begin, " +
													"related_sensors.dry_season_end " +
                                                "FROM " +
													"(" +
														"SELECT " +
															"sensor_id, " +
															"water_body_id, " +
															"coordinates " +
														"FROM Sensors " +
														"WHERE sensor_id=$1" +
													") AS main_sensor, " +
                                                    "Sensors related_sensors JOIN Water_Bodies water_bodies ON related_sensors.water_body_id=water_bodies.water_body_id " +
                                                "WHERE related_sensors.sensor_id != main_sensor.sensor_id " +
												"AND (" +
													"related_sensors.private=false OR (" +
														"related_sensors.private=true AND related_sensors.creator=$2" +
													")" +
												") " +
												"AND related_sensors.water_body_id = main_sensor.water_body_id " +
                                                "ORDER BY distance ASC;";

                                                // Database query
                                                client.query(query, [
                                                    req.params.sensor_id,
                                                    username
                                                ], function(err, result) {
                                                    done();

                                                    if (err) {
                                                        res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
                                                        return console.error(errors.database.error_2.message, err);
                                                    } else {

                                                        // Send Result
                                                        res.status(200).send(result.rows);
                                                    }
                                                });

                                            } else {
                                                res.status(errors.authentication.error_2.code).send(errors.authentication.error_2);
                                                return console.error(errors.authentication.error_2.message);
                                            }
                                        }
                                    }
                                }
                            });
                        }
                    }
                }
            });
        }
    });
};
