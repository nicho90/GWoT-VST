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

    console.log("RT-Message", new Date(), message);

    // Start pipeline
    async.waterfall([

            // 1. Find sensor_id in Sensors with device_id
            function(callback) {
                // Parse measurement
                var measurement = JSON.parse(message).features[0];

                // Create URL
                var url = "postgres://" + db_settings.user + ":" + db_settings.password + "@" + db_settings.host + ":" + db_settings.port + "/" + db_settings.database_name;

                // Connect to Database
                pg.connect(url, function(err, client, done) {

                    if (err) {
                        return console.error(errors.database.error_1.message, err);
                    } else {

                        // Database query: select sensors
                        client.query('SELECT * FROM Sensors WHERE device_id=$1;', [
                            measurement.properties.device_id
                        ], function(err, result) {
                            done();

                            if (err) {
                                console.error(errors.database.error_2.message, err);
                                callback(new Error(errors.database.error_2.message));
                            } else {
                                if (result.rows.length > 0) {
                                    //console.log(result.rows[0]);
                                    callback(null, measurement, result.rows[0]);
                                } else {
                                    console.error(errors.query.error_2.message);
                                    callback(new Error(errors.query.error_2.message));
                                }
                            }
                        });
                    }
                });
            },

            // 2. Reject measurement if measured distance > sensor height
            function(measurement, sensor, callback) {
                if (measurement.properties.distance.value > sensor.sensor_height) {
                    //console.log("Distance: ", measurement.properties.distance.value);
                    callback(new Error(errors.measurement.error_1.message));
                } else {
                    callback(null, measurement);
                }
            },

            // 3. Forward message via websockets
            function(measurement, callback) {
                //console.log("Send socket notification for realtime:", measurement);
                io.sockets.emit('/data/realtime', measurement);
                callback();
            }

        ],
        function(err, callback) {
            if (err) {
                console.log(err, new Date(), "Realtime");
            } else {
                console.log("RT-Pipeline has been finished! " + new Date());
            }
        });
};
