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
    var io = require('../server.js').io;


    // Create URL
    var url = "postgres://" + db_settings.user + ":" + db_settings.password + "@" + db_settings.host + ":" + db_settings.port + "/" + db_settings.database_name;

    // Connect to Database
    pg.connect(url, function(err, client, done) {

        console.log("Scheduled Message", new Date(), message);
        if (err) {
            return console.error(errors.database.error_1.message, err);
        } else {

            // Start pipeline
            async.waterfall([

                    // 1. Calculate Median
                    function(callback) {
                        var measurements = JSON.parse(message).features;
                        var measurement = median(measurements); // Select the median measurement
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
                                console.error("Step 2: select sensors", errors.database.error_2.message, err);
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
                                console.error("Step 4: save measurement", errors.database.error_2.message, err);
                                callback(new Error(errors.database.error_2.message));
                            } else {
                                callback(null, measurement, sensor);
                            }
                        });
                    },

                    // 5. Check Sensor-Settings for sensor-threshold
                    function(measurement, sensor, callback) {
                        /*console.log("Distance: " + measurement.properties.distance.value, "Water Level: " + (sensor.sensor_height - measurement.properties.distance.value), "Threshold: " + sensor.threshold_value, new Date());*/

                        var message;
                        if ((sensor.sensor_height - measurement.properties.distance.value) > sensor.threshold_value) {

                            // Only increase if not increased yet
                            if (!sensor.increased_frequency) {

                                // Send MQTT-Message increase frequency
                                message = {
                                    topic: '/settings',
                                    payload: '{"device_id": "' + sensor.device_id + '","interval": ' + sensor.danger_frequency + '}', // String or a Buffer
                                    qos: 1, // quality of service: 0, 1, or 2
                                    retain: true
                                };
                                broker.publish(message, function() {
                                    //console.log("Message send at time " + new Date());
                                });

                                // Change increased_frequency value
                                client.query('UPDATE Sensors SET increased_frequency=true, triggered_threshold=true WHERE device_id=$1;', [
                                    sensor.device_id
                                ], function(err, result) {
                                    done();

                                    if (err) {
                                        console.error("Step 5: change increased_frequency value", errors.database.error_2.message, err);
                                        callback(new Error(errors.database.error_2.message));
                                    } else {
                                        callback(null, measurement, sensor);
                                    }
                                });
                            } else {
                                callback(null, measurement, sensor);
                            }

                        } else {

                            // Only decrease if not increased and sensor was not increased of weather-service
                            if (sensor.increased_frequency && !sensor.triggered_weather) {

                                // Send MQTT-Message decrease frequency
                                message = {
                                    topic: '/settings',
                                    payload: '{"device_id": "' + sensor.device_id + '","interval": ' + sensor.default_frequency + '}', // String or a Buffer
                                    qos: 1, // quality of service: 0, 1, or 2
                                    retain: true
                                };
                                broker.publish(message, function() {
                                    //console.log("Message send at time " + new Date());
                                });

                                // Change increased_frequency value
                                client.query('UPDATE Sensors SET increased_frequency=false, triggered_threshold=false WHERE device_id=$1;', [
                                    sensor.device_id
                                ], function(err, result) {
                                    done();

                                    if (err) {
                                        console.error("Step 5: change increased_frequency value", errors.database.error_2.message, err);
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

                        // Query distinct subscriber for possibly several subscriptions
                        /* e.g.
                        username | email_address | first_name | last_name
                        ---------+---------------+------------+-----------
                        m_must1  | max@muster.de | Max        | M.
                        */
                        var query = "SELECT DISTINCT " +
                                "users.username, " +
                                "users.email_address, " +
                                "users.first_name, " +
                                "users.last_name " +
                            "FROM Subscriptions subscriptions JOIN Users users ON subscriptions.creator=users.username " +
                            "WHERE subscriptions.sensor_id=$1;";

                        // Database query
                        client.query(query, [
                            sensor.sensor_id
                        ], function(err, result) {
                            done();

                            if (err) {
                                console.error("Step 6: query subscribers", errors.database.error_2.message, err);
                                callback(new Error(errors.database.error_2.message));
                            } else {
                                //console.log("Result of query: subscribed users", result.rows);
                                callback(null, measurement, sensor, result.rows);
                            }
                        });
                    },

                    // 7. Check all Thresholds of subscribed Users for this sensor
                    function(measurement, sensor, users, callback) {

                        async.each(users, function(user, callback) {

                            // Query warning and danger threshold values
                            /* e.g.
                            subscription_id | threshold_id | creator |     description     |  category  |  level
                            ----------------+--------------+---------+---------------------+------------+---------
                                          1 |            1 | nicho90 | Myself              | PEDESTRIAN | warning
                                          2 |            2 | nicho90 | VW Golf (2015)      | CAR        | danger
                            */
                            var query = "(" +
                                    "SELECT " +
                                        "subscriptions.subscription_id, " +
                                        "subscriptions.threshold_id, " +
                                        "subscriptions.creator, " +
                                        "thresholds.description, " +
                                        "thresholds.category, " +
                                        "'warning' AS level " + // warning-level
                                    "FROM Subscriptions subscriptions JOIN Thresholds thresholds ON subscriptions.threshold_id=thresholds.threshold_id " +
                                    "WHERE subscriptions.sensor_id=" + sensor.sensor_id + " AND subscriptions.warning_notified=false" + " AND subscriptions.creator='" + user.username + "' AND (" + sensor.sensor_height + " - " + measurement.properties.distance.value + ") >= (" + sensor.crossing_height + " + thresholds.warning_threshold) AND (" + sensor.sensor_height + " - " + measurement.properties.distance.value + ") < (" + sensor.crossing_height + " + thresholds.critical_threshold)" +
                                ") " +
                                "UNION ALL " + // Merge with critical-level
                                "(" +
                                    "SELECT " +
                                        "subscriptions.subscription_id, " +
                                        "subscriptions.threshold_id, " +
                                        "subscriptions.creator, " +
                                        "thresholds.description, " +
                                        "thresholds.category, " +
                                        "'danger' AS level " + // danger-level
                                    "FROM Subscriptions subscriptions JOIN Thresholds thresholds ON subscriptions.threshold_id=thresholds.threshold_id " +
                                    "WHERE subscriptions.sensor_id=" + sensor.sensor_id + " AND subscriptions.danger_notified=false" + " AND subscriptions.creator='" + user.username + "' AND (" + sensor.sensor_height + " - " + measurement.properties.distance.value + ") >= (" + sensor.crossing_height + " + thresholds.critical_threshold)" +
                                ");";

                            // Database query
                            client.query(query, function(err, result) {
                                done();

                                if (err) {
                                    console.error("Step 7: query warning and critical thresholds", errors.database.error_2.message, err);
                                    callback(new Error(errors.database.error_2.message));
                                } else {
                                    //console.log("Result of query: warning and danger threshold values", result.rows);

                                    if (result.rows.length > 0) {

                                        //console.log("Thresholds length = ", result.rows.length);
                                        var triggered_thresholds = result.rows;

                                        // Change warning and danger notification status in DB
                                        async.each(triggered_thresholds, function(row, callback) {
                                            //console.log("Row: ", row);
                                            /* e.g. message conteent
                                            { subscription_id: 2, threshold_id: 2, creator: "nicho90", description: "VW Golf (2015)", category: "CAR", level: "danger" }
                                            */
                                            if (row.level == "warning") {
                                                // Change warning_notified value
                                                client.query('UPDATE Subscriptions SET warning_notified=true WHERE subscription_id=$1;', [
                                                    row.subscription_id
                                                ], function(err, result) {
                                                    done();
                                                    if (err) {
                                                        console.error("Step 7: change warning_notified value", errors.database.error_2.message, err);
                                                    } else {
                                                        callback();
                                                    }
                                                });
                                            } else if (row.level == "danger") {
                                                // Change warning_notified value
                                                client.query('UPDATE Subscriptions SET danger_notified=true WHERE subscription_id=$1;', [
                                                    row.subscription_id
                                                ], function(err, result) {
                                                    done();
                                                    if (err) {
                                                        console.error("Step 7: change warning_notified value", errors.database.error_2.message, err);
                                                    } else {
                                                        callback();
                                                    }
                                                });
                                            }
                                        }, function(err) {
                                            console.error(err);
                                        });

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
                                                'GSys by Institute for Geoinformatics (Heisenbergstraße 2, 48149 Münster, Germany)';

                                            // Set Mail options
                                            var mailOptions = {
                                                from: _mailOptions.from,
                                                to: user.email_address,
                                                subject: 'One or more thresholds has been triggered!',
                                                text: text,
                                                html: output
                                            };

                                            // Send Email
                                            transporter.sendMail(mailOptions, function(err, info) {
                                                if (err) {
                                                    console.error(err);
                                                } else {
                                                    console.log('Message sent: ' + info.response);
                                                }
                                            });
                                        });

                                        // Emit Websocket-notification if triggered_thresholds.length > 0!
                                        //console.log("Publishing socket");
                                        async.each(triggered_thresholds, function(row, callback) {
                                            //console.log("Send socket notification for threshold:", row);
                                            var content = {
                                                "subscription_id": row.subscription_id,
                                                "threshold_id": row.threshold_id,
                                                "creator": row.creator,
                                                "description": row.description,
                                                "category": row.category,
                                                "level": row.level,
                                                "device_id": measurement.properties.device_id,
                                                "height": sensor.sensor_height - measurement.properties.distance.value,
                                            };
                                            io.sockets.emit('/notification/threshold', content);
                                            callback();
                                        }, function(err) {
                                          //TODO
                                          callback();
                                        });

                                    } else {
                                        //console.log("Thresholds length = 0");
                                        callback();
                                    }
                                }
                            });
                        }, function(err) {
                            if (err) {
                                console.log("7. Error", measurement, sensor, users);
                                console.log(err);
                                callback(err);
                            } else {
                                //console.log("Emails were sent to all users!");
                                callback(null, measurement, sensor, users);
                            }
                        });

                    },

                    // 8. Check all Threshold notifications
                    function(measurement, sensor, users, callback) {
                        // update warning subscriptions that have been notified and lie (x cm) under warning level
                        async.each(users, function(user, callback) {

                            var query = "UPDATE Subscriptions AS sc " +
                                "SET warning_notified=false " +
                                "FROM Subscriptions subscriptions JOIN Thresholds thresholds ON subscriptions.threshold_id=thresholds.threshold_id " +
                                "WHERE subscriptions.sensor_id=" + sensor.sensor_id + " AND subscriptions.warning_notified=true" + " AND subscriptions.creator='" + user.username + "' AND (" + sensor.sensor_height + " - " + measurement.properties.distance.value + ") < (" + sensor.crossing_height + " + thresholds.warning_threshold);";

                            // Database query

                            client.query(query, function(err, result) {
                                done();

                                if (err) {
                                    console.error("Step 8: reset warning thresholds notification", errors.database.error_2.message, err);
                                    callback(new Error(errors.database.error_2.message));
                                } else {
                                  // update danger subscriptions that have been notified and lie (x cm) under danger level
                                  query = "UPDATE Subscriptions AS sc " +
                                      "SET danger_notified=false " +
                                      "FROM Subscriptions subscriptions JOIN Thresholds thresholds ON subscriptions.threshold_id=thresholds.threshold_id " +
                                      "WHERE subscriptions.sensor_id=" + sensor.sensor_id + " AND subscriptions.danger_notified=true" + " AND subscriptions.creator='" + user.username + "' AND (" + sensor.sensor_height + " - " + measurement.properties.distance.value + ") < (" + sensor.crossing_height + " + thresholds.critical_threshold);";


                                  client.query(query, function(err, result) {
                                      done();

                                      if (err) {
                                          console.error("Step 8: reset danger thresholds notification", errors.database.error_2.message, err);
                                          callback(new Error(errors.database.error_2.message));
                                      } else {
                                          callback();
                                      }
                                  });
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
                ],

                // End waterfall
                function(err, callback) {
                    if (err) {
                        console.log("Waterfall error", new Date(), err);
                    } else {
                        console.log("SD-Pipeline has been finished! " + new Date());
                    }
                });
        }
    });
};


/**
 * Calculate Median from 5 measurement values
 * @param  values
 * @return median
 */
function median(values) {
    values.sort(function(a, b) {
        return a.properties.distance.value - b.properties.distance.value;
    });
    var half = Math.floor(values.length / 2);
    return values[half];
}
