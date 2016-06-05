var pg = require('pg');
var types = require('pg').types;
types.setTypeParser(1700, 'text', parseFloat);
var _ = require('underscore');
var jwt = require('jsonwebtoken');
var secret = require('./../../config/secret');
var db_settings = require('../../server.js').db_settings;
var errors = require('./../../config/errors');
var verifier = require('./../../config/verifier');


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
            client.query('SELECT * FROM Sensors WHERE sensor_id=$1;', [
                req.params.sensor_id
            ], function(err, result) {
                done();

                if(err) {
                    res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
                    return console.error(errors.database.error_2.message, err);
                } else {

                    // Check if sensor exists
                    if(result.rows.length === 0) {
                        res.status(errors.query.error_2.code).send(errors.query.error_2);
                        return console.error(errors.query.error_2.message);
                    } else {

                        // Prepare Query
                        var query = "SELECT " +
                            "related_sensors.sensor_id, " +
                            "ST_Distance(related_sensors.coordinates, main_sensor.coordinates) AS distance, " +
                            "'METER' AS distance_unit, " +
                            "related_sensors.device_id, " +
                            "related_sensors.description, " +
                            "related_sensors.private, " +
                            "related_sensors.online_status, " +
                            "related_sensors.water_body_id, " +
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
                            "related_sensors.threshold_value, " +
                            "'CENTIMETER' AS threshold_value_unit, " +
                            "ST_X(related_sensors.coordinates::geometry) AS lng, " +
                            "ST_Y(related_sensors.coordinates::geometry) AS lat " +
                        "FROM " +
                            "(SELECT sensor_id, coordinates " +
                                "FROM Sensors " +
                                "WHERE sensor_id=$1) " +
                            "AS main_sensor, " +
                            "Sensors related_sensors JOIN Water_Bodies water_bodies ON related_sensors.water_body_id=water_bodies.water_body_id " +
                        "WHERE related_sensors.sensor_id != main_sensor.sensor_id " +
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
                    }
                }
            });
        }
    });
};
