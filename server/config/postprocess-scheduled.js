var pg = require('pg');
var db_settings = require('../server.js').db_settings;
var async = require('async');
var errors = require('./errors');


/**
 * Postprocess Observations from the Scheduled topic
 */
exports.process = function(message) {

  // Create URL
  var url = "postgres://" + db_settings.user + ":" + db_settings.password + "@" + db_settings.host + ":" + db_settings.port + "/" + db_settings.database_name;

  // Connect to Database
  pg.connect(url, function(err, client, done) {

    if (err) {
      return console.error(errors.database.error_1.message, err);
    } else {

      // Start pipeline
      async.waterfall([

        // Calculate Median
        function(callback) {
          var measurements = JSON.parse(message).features;
          var measurement = median(measurements); //Select the median measurement
          //console.log("Half: ", measurement);
          callback(null, measurement);
        },

        // Find sensor_id in Sensors with device_id
        function(measurement, callback) {

          // Database query
          client.query('SELECT sensor_id, device_id FROM Sensors WHERE device_id=$1;', [
            measurement.properties.device_id
          ], function(err, result) {
            done();

            if (err) {
              return console.error(errors.database.error_2.message, err);
            } else {
              if (result.rows.length > 0) {

                console.log(result.rows[0].sensor_id);

                callback(null, measurement, result.rows[0].sensor_id);
              } else {

                // TODO Abbruch
                callback(null, measurement, null);
              }
            }
          });
        },
        function(measurement, sensor_id, callback) {

          console.log("Second callback ", measurement, sensor_id);

          // Database query
          /*client.query('INSERT INTO Measurements (created, updated, sensor_id, distance, measured) VALUES (now(), now(), $1, $2, now());', [
            sensor_id,
            measurement.distance //,
            // TODO: Use measurement.measured instead of now()
          ], function(err, result) {
            done();

            if (err) {
              return console.error(errors.database.error_2.message, err);
            } else {
              callback(null, sensor_id);
            }
          });*/
        }
      ], function(callback) {
        console.log("waterfall callback");
      });
    }
  });
};


/**
 * Calculate Median from 5 measurement values
 * @param  {[type]} values [description]
 * @return {[type]}        [description]
 */
var median = function(values) {
  values.sort(function(a, b) {
    return a.properties.distance.value - b.properties.distance.value;
  });
  var half = Math.floor(values.length / 2);
  return values[half];
};
