var pg = require('pg');
var types = require('pg').types;
types.setTypeParser(1700, 'text', parseFloat);
var _ = require('underscore');
var jwt = require('jsonwebtoken');
var secret = require('./../../config/secret');
var db_settings = require('../../server.js').db_settings;
var errors = require('./../../config/errors');


// LIST
exports.request = function(req, res) {

    // Create URL
    var url = "postgres://" + db_settings.user + ":" + db_settings.password + "@" + db_settings.host + ":" + db_settings.port + "/" + db_settings.database_name;

    // Connect to Database
    pg.connect(url, function(err, client, done) {
        if (err) {
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

                        // Prepare Query
                        var query = "SELECT " +
                            "service_stations.service_station_id, " +
                            "ST_Distance(service_stations.coordinates, sensors.coordinates) AS distance, " +
                            "'METER' AS distance_unit, " +
                            "service_stations.name, " +
                            "service_stations.phone_number, " +
                            "ST_X(service_stations.coordinates::geometry) AS lng, " +
                            "ST_Y(service_stations.coordinates::geometry) AS lat, " +
                            "service_stations.street, " +
                            "service_stations.house_number, " +
                            "service_stations.addition, " +
                            "service_stations.zip_code, " +
                            "service_stations.city, " +
                            "service_stations.country " +
                            "FROM Service_stations service_stations, Sensors sensors " +
                            "WHERE sensors.sensor_id=$1 ORDER BY distance ASC LIMIT 5;";

                        // Check if Sensor was public
                        if(!sensor.private) {

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

                                        // Check if User was creator of private Sensor or is admin
                                        if(username === sensor.creator || username === db.admin){

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
                                            res.status(errors.authentication.error_2.code).send(errors.authentication.error_2);
                                            return console.error(errors.authentication.error_2.message);
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
            });
        }
    });
};
