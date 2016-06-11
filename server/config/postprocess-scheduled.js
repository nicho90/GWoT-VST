/**
 * Postprocess Observations from the Scheduled topic
 */
exports.process = function(message) {

    var broker = require('./mqtt-message-handler.js');
    var pg = require('pg');
    var db_settings = require('../server.js').db_settings;
    var async = require('async');
    var errors = require('./errors');

    var transporter = require('./email.js').transporter;
    var _mailOptions = require('./email.js').mailOptions;
    var path = require('path');
    var fs = require('fs');
    var mustache = require('mustache');


    // Create URL
    var url = "postgres://" + db_settings.user + ":" + db_settings.password + "@" + db_settings.host + ":" + db_settings.port + "/" + db_settings.database_name;

    // Connect to Database
    pg.connect(url, function(err, client, done) {

        if (err) {
            return console.error(errors.database.error_1.message, err);
        } else {

            // Start pipeline
            async.waterfall([

                // 1. Calculate Median
                function(callback) {
                    var measurements = JSON.parse(message).features;
                    var measurement = median(measurements); //Select the median measurement
                    callback(null, measurement);
                },

                // 2. Find sensor_id in Sensors with device_id
                function(measurement, callback) {

                    // Database query
                    client.query('SELECT * FROM Sensors WHERE device_id=$1;', [
                        measurement.properties.device_id
                    ], function(err, result) {
                        done();

                        if (err) {
                            console.error(errors.database.error_2.message, err);
                            callback(new Error(errors.database.error_2.message));
                        } else {
                            if (result.rows.length > 0) {
                                callback(null, measurement, result.rows[0]);
                            } else {
                                console.error(errors.query.error_2.message);
                                callback(new Error(errors.query.error_2.message));
                            }
                        }
                    });
                },

                // 3. Reject measurement if measured distance > sensor height
                function(measurement, sensor, callback) {
                    if (measurement.properties.distance.value > sensor.sensor_height) {
                        callback(new Error(errors.measurement.error_1.message));
                    } else {
                        callback(null, measurement, sensor);
                    }
                },

                // 4. Save new measuremt in Database
                function(measurement, sensor, callback) {

                    // Database query
                    client.query('INSERT INTO Measurements (created, updated, sensor_id, distance, water_level, measurement_timestamp) VALUES (now(), now(), $1, $2, $3, $4);', [
                        sensor.sensor_id,
                        measurement.properties.distance.value,
                        sensor.sensor_height - measurement.properties.distance.value,
                        measurement.properties.timestamp
                    ], function(err, result) {
                        done();

                        if (err) {
                            console.error(errors.database.error_2.message, err);
                            callback(new Error(errors.database.error_2.message));
                        } else {
                            callback(null, measurement, sensor);
                        }
                    });
                },

                // 5. Check Sensor-Settings for threshold
                function(measurement, sensor, callback) {
                    console.log("Distance: " + measurement.properties.distance.value, "Water Level: " + (sensor.sensor_height-measurement.properties.distance.value), "Threshold: " + sensor.threshold_value, new Date());

                    var message;
                    if ((sensor.sensor_height-measurement.properties.distance.value) > sensor.threshold_value) {

                        // only increase if not increased yet
                        if (!sensor.increased_frequency) {

                            // Send MQTT-Message increase frequency
                            message = {
                                topic: '/settings',
                                payload: '{"device_id": "rpi-1","interval": ' + sensor.danger_frequency + '}', // String or a Buffer
                                qos: 1, // quality of service: 0, 1, or 2
                                retain: true // or true
                            };
                            broker.publish(message, function() {
                                console.log("Message send at time " + new Date());
                            });
                            // change increased_frequency value
                            client.query('UPDATE Sensors SET increased_frequency=true WHERE device_id=$1;', [
                                sensor.device_id
                            ], function(err, result) {
                                done();

                                if (err) {
                                    console.error(errors.database.error_2.message, err);
                                    callback(new Error(errors.database.error_2.message));
                                } else {
                                    callback(null, measurement, sensor);
                                }
                            });
                        } else {
                            callback(null, measurement, sensor);
                        }

                    } else {

                        //only decrease if not decrease
                        if (sensor.increased_frequency) {
                            // Send MQTT-Message decrease frequency
                            message = {
                                topic: '/settings',
                                payload: '{"device_id": "rpi-1","interval": ' + sensor.default_frequency + '}', // String or a Buffer
                                qos: 1, // quality of service: 0, 1, or 2
                                retain: true // or true
                            };
                            broker.publish(message, function() {
                                console.log("Message send at time " + new Date());
                            });
                            // change increased_frequency value
                            client.query('UPDATE Sensors SET increased_frequency=false WHERE device_id=$1;', [
                                sensor.device_id
                            ], function(err, result) {
                                done();

                                if (err) {
                                    console.error(errors.database.error_2.message, err);
                                    callback(new Error(errors.database.error_2.message));
                                } else {
                                    callback(null, measurement, sensor);
                                }
                            });
                        } else {
                            callback(null, measurement, sensor);
                        }
                    }
                },

                // 6. Get all subscribed Users for this sensor
                function(measurement, sensor, callback) {

                    var query = "SELECT DISTINCT " +
                        "users.username, " +
                        "users.email_address, " +
                        "users.first_name, " +
                        "users.last_name " +
                        "FROM Subscriptions subscriptions JOIN Users users ON subscriptions.username=users.username " +
                        "WHERE subscriptions.sensor_id=$1;";

                    // Database query
                    client.query(query, [
                        sensor.sensor_id
                    ], function(err, result) {
                        done();

                        if (err) {
                            console.error(errors.database.error_2.message, err);
                            callback(new Error(errors.database.error_2.message));
                        } else {
                            callback(null, measurement, sensor, result.rows);
                        }
                    });
                },

                // 7. Check all Thresholds of subscribed Users for this sensor
                function(measurement, sensor, users, callback) {

                    async.each(users, function(user, callback) {

                        var query = "" +
                                "(SELECT " +
                                    "subscriptions.subscription_id, " +
                                    "subscriptions.threshold_id, " +
                                    "thresholds.description, " +
                                    "thresholds.category, " +
                                    "'warning' AS level " + // warning-level
                                    "FROM Subscriptions subscriptions JOIN Thresholds thresholds ON subscriptions.threshold_id=thresholds.threshold_id " +
                                    "WHERE subscriptions.sensor_id=" + sensor.sensor_id + " AND subscriptions.username='" + user.username + "' AND (" + sensor.sensor_height + " - " + measurement.properties.distance.value + ") >= (" + sensor.crossing_height + " + thresholds.warning_threshold) AND (" + sensor.sensor_height + " - " + measurement.properties.distance.value + ") < (" + sensor.crossing_height + " + thresholds.critical_threshold)) " +
                            "UNION ALL " + // Merge with critical-level
                                "(SELECT " +
                                    "subscriptions.subscription_id, " +
                                    "subscriptions.threshold_id, " +
                                    "thresholds.description, " +
                                    "thresholds.category, " +
                                    "'danger' AS level " + // danger-level
                                    "FROM Subscriptions subscriptions JOIN Thresholds thresholds ON subscriptions.threshold_id=thresholds.threshold_id " +
                                    "WHERE subscriptions.sensor_id=" + sensor.sensor_id + " AND subscriptions.username='" + user.username + "' AND (" + sensor.sensor_height + " - " + measurement.properties.distance.value + ") >= (" + sensor.crossing_height + " + thresholds.critical_threshold));";

                        // Database query
                        client.query(query, function(err, result) {
                            done();

                            if (err) {
                                console.error(errors.database.error_2.message, err);
                                callback(new Error(errors.database.error_2.message));
                            } else {

                                if (result.rows.lenght > 0) {

                                    console.log(result.rows);
                                    var triggered_thresholds = result.rows;

                                    // Read Template
                                    fs.readFile(path.join(__dirname, '../templates/notification.html'), function(err, data) {
                                        if (err) throw err;

                                        // Render HTML-content
                                        var output = mustache.render(data.toString(), user, sensor, triggered_thresholds);

                                        // Create Text for Email-Previews and Email without HTML-support
                                        var text =
                                            'Attention ' + user.first_name + ' ' + user.last_name + '!\n' +
                                            'At least one of your thresholds has been triggered for a  sensor, which you are subscribed to!\n\n\n' +
                                            // TODO: Input Sensor and list all thresholds
                                            'GWoT-VST - Institute for Geoinformatics (Heisenbergstraße 2, 48149 Münster, Germany)';

                                        // Set Mail options
                                        var mailOptions = {
                                            from: _mailOptions.from,
                                            to: user.email_address,
                                            subject: 'One or more thresholds has been triggered!',
                                            text: text,
                                            html: output
                                        };

                                        // Send Email
                                        /*transporter.sendMail(mailOptions, function(error, info) {
                                            if (error) {
                                                return console.log(error);
                                            } else {
                                                console.log('Message sent: ' + info.response);
                                            }
                                        });*/
                                    });

                                    // TODO:
                                    // - Emit Websocket-notification if result.rows.lenght > 0!

                                    callback();
                                } else {
                                    callback();
                                }
                            }
                        });
                    }, function(err) {
                        if (err) {
                            console.log(err);
                            callback(err);
                        } else {
                            //console.log("Emails were sent to all users!");
                            callback(null);
                        }
                    });

                }
            ], function(err, callback) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Pipeline has been finished! " + new Date());
                }
            });
        }
    });
};


/**
 * Calculate Median from 5 measurement values
 * @param  {[type]} values [description]
 * @return {[type]}        [description]
 */
function median(values) {
    values.sort(function(a, b) {
        return a.properties.distance.value - b.properties.distance.value;
    });
    var half = Math.floor(values.length / 2);
    return values[half];
}
