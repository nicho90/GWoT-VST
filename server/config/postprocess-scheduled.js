var pg = require('pg');
var db_settings = require('../../server.js').db_settings;

/**
 * Postprocess Observations from the Scheduled topic
 */
exports.process = function(message) {
  var measurements = JSON.parse(message).features;

  var medianMeasurement = median(measurements); //Select the median measurement
  console.log("Half: ", medianMeasurement);

  // Create URL
  var url = "postgres://" + db_settings.user + ":" + db_settings.password + "@" + db_settings.host + ":" + db_settings.port + "/" + db_settings.database_name;

  // TODO match device_id with sensors-table
  pg.connect(url, function(err, client, done) {
      if (err) {
          res.status(errors.database.error_1.code).send(errors.database.error_1);
          return console.error(errors.database.error_1.message, err);
      } else {
          // Database query
          client.query('SELECT device_id FROM Sensors;', function(err, result) {
              done();
              if (err) {
                  return console.error(errors.database.error_2.message, err);
              } else {
                  console.log("Database resp.: ", result.rows)
              }
          });
      }
  });
  
  // TODO push measurment to measurments-table
};

var median = function(values) {
    values.sort(function(a, b) {
        return a.properties.distance.value - b.properties.distance.value;
    });
    var half = Math.floor(values.length / 2);
    return values[half];
};
