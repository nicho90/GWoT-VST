var pg = require('pg');
var types = require('pg').types;
types.setTypeParser(1700, 'text', parseFloat);
var _ = require('underscore');
var jwt = require('jsonwebtoken');
var secret = require('./../../config/secret');
var db = require('./../../config/db');
var db_settings = require('../../server.js').db_settings;
var errors = require('./../../config/errors');
var verifier = require('./../../config/verifier');


// PUT
exports.request = function(req, res) {

    // TODO: Schema-Validation

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
                            client.query('SELECT * FROM Users WHERE username=$1;', [
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
                                        client.query('SELECT * FROM Sensors WHERE creator=$1 AND sensor_id=$2;', [
                                            req.params.username,
                                            req.params.sensor_id
                                        ], function(err, result) {
                                            done();

                                            if(err) {
                                                res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
                                                return console.error(errors.database.error_2.message, err);
                                            } else {

                                                console.log("TEST:");
                                                console.log(result.rows);

                                                // Check if Sensor exists
                                                if(result.rows.length === 0) {
                                                    res.status(errors.query.error_2.code).send(errors.query.error_2);
                                                    return console.error(errors.query.error_2.message);
                                                } else {

                                                    // Prepare Query
                									var query = "UPDATE Sensors SET " +
                										"updated=now(), " +
                										"device_id=($1), " +
                										"description=($2), " +
                										"private=($3), " +
                										"water_body_id=($4), " +
                										"sensor_height=($5), " +
                										"crossing_height=($6), " +
                										"default_frequency=($7), " +
                										"danger_frequency=($8), " +
                										"threshold_value=($9), " +
                										"coordinates='POINT(" + req.body.lng + " " + req.body.lat + ")' " +
                										"WHERE creator=$10 AND sensor_id=$11;";

                									// Database Query
                									client.query(query, [
                										req.body.device_id,
                										req.body.description,
                										req.body.private,
                										req.body.water_body_id,
                										req.body.sensor_height,
                										req.body.crossing_height,
                										req.body.default_frequency,
                										req.body.danger_frequency,
                										req.body.threshold_value,
                                                        req.params.username,
                										req.params.sensor_id
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
                                                                "WHERE sensors.creator=$1 AND sensor_id=$2;";

                                                            // Database Query
                                                            client.query(query, [
                                                                req.params.username,
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

                                                                        // Send Result
                                                                        res.status(200).send(result.rows[0]);
                                                                    }
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
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
