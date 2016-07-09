/**
 * Time-Series Creator
 */
var program = require('commander');
var pg = require('pg');
var async = require('async');
var moment = require('moment');
var _ = require('underscore');
var db_settings = require('./config/db').db_settings;


/**
 * Check Command-Line parameters
 */
program
    .version('1.0.0')
    .option('-dbu, --postgres_user [username]', 'Enter the PostgreSQL-User, which is needed to connect to the database', 'admin')
    .option('-dbpw, --postgres_password [password]', 'Enter the PostgreSQL-Password, which is needed to connect to the database', 'password')
    .parse(process.argv);

var db_settings = {
    status: false,
    user: "",
    password: ""
};
db_settings = _.extend(db_settings, require('./config/db'));

if (program.postgres_user != "admin" && program.postgres_password != "password") {
    db_settings.status = true;
    db_settings.user = program.postgres_user;
    db_settings.password = program.postgres_password;
}

// Check if Database-Settings were submitted
if (!db_settings.status) {
    return console.error('No username or password for Database submitted!');
} else {

    // Create URL
    var url = "postgres://" + db_settings.user + ":" + db_settings.password + "@" + db_settings.host + ":" + db_settings.port + "/" + db_settings.database_name;

    // Connect to Database
    pg.connect(url, function(err, client, done) {
        if (err) {
            return console.error('Error fetching client from pool', err);
        } else {

            // Start Aggregating
            async.waterfall([

                // 1. Get all sensors
                function(callback) {

                    // Database Query
                    client.query("SELECT * FROM Sensors", function(err, result) {
                        done();

                        if (err) {
                            return console.error('Error running query', err);
                        } else  {
                            callback(null, result.rows);
                        }
                    });
                },

                // 2. Calculate average waterlevel for last day for every sensor
                function(sensors, callback) {

                    // PostgreSQL-timestamp: "2016-05-17 00:20:53.248363+02"
                    var yesterday = moment().add(-1, 'days');
                    var begin = yesterday.format("YYYY-MM-DD") + " 00:00:00";
                    var _begin = yesterday.format("YYYY-MM-DD");
                    var end = yesterday.format("YYYY-MM-DD") + " 23:59:59";

                    //console.log(begin);
                    //console.log(end);

                    async.each(sensors, function(sensor, callback) {

                        // Database Query
                        client.query("SELECT AVG(water_level) AS water_level, STDDEV_SAMP(water_level) AS sd_water_level, COUNT(*) AS num_measurements FROM Measurements WHERE sensor_id=$1 AND measurement_timestamp >=$2 AND measurement_timestamp <=$3;", [
                            sensor.sensor_id,
                            begin,
                            end
                        ], function(err, result) {
                            done();

                            if (err) {
                                return console.error('Error running query', err);
                            } else  {

                                if (result.rows[0].water_level !== null) { // At least one measurement

                                    if (result.rows[0].sd_water_level !== null) { // More than one measurement

                                        // Database Query
                                        client.query("INSERT INTO Timeseries (created, updated, sensor_id, water_level, sd_water_level, num_measurements, measurement_date, valid_data) VALUES (now(), now(), $1, $2, $3, $4, $5, $6);", [
                                            sensor.sensor_id,
                                            result.rows[0].water_level,
                                            result.rows[0].sd_water_level,
                                            result.rows[0].num_measurements,
                                            _begin,
                                            true
                                        ], function(err, result) {
                                            done();

                                            if (err) {
                                                return console.error('Error running query', err);
                                            } else  {
                                                console.log("Timeseries created for SensorId:" + sensor.sensor_id + " on date " + _begin);
                                                callback(null, _begin);
                                            }
                                        });
                                    } else { // Only one measurement

                                        console.log("Only one measurement found for SensorId '" + sensor.sensor_id + "'!");

                                        // Database Query
                                        // TODO insert here zero values
                                        client.query("INSERT INTO Timeseries (created, updated, sensor_id, water_level, sd_water_level, num_measurements, measurement_date, valid_data) VALUES (now(), now(), $1, $2, $3, $4, $5, $6);", [
                                            sensor.sensor_id,
                                            result.rows[0].water_level,
                                            0,
                                            1,
                                            _begin,
                                            false
                                        ], function(err, result) {
                                            done();

                                            if (err) {
                                                return console.error('Error running query', err);
                                            } else  {
                                                callback(null, _begin);
                                            }
                                        });
                                    }
                                } else { // No measurement

                                    console.log("No measurements found for SensorId '" + sensor.sensor_id + "'!");

                                    // Database Query
                                    // TODO insert here zero values
                                    client.query("INSERT INTO Timeseries (created, updated, sensor_id, water_level, sd_water_level, num_measurements, measurement_date, valid_data) VALUES (now(), now(), $1, $2, $3, $4, $5, $6);", [
                                        sensor.sensor_id,
                                        0,
                                        0,
                                        0,
                                        _begin,
                                        false
                                    ], function(err, result) {
                                        done();

                                        if (err) {
                                            return console.error('Error running query', err);
                                        } else  {
                                            callback(null, _begin);
                                        }
                                    });
                                }
                            }
                        });

                        // End waterfall
                    }, function(err) {
                        if (err) {
                            console.error(err.message);
                        } else {
                            callback(null, _begin);
                        }
                    });
                }
            ], function(err, result) {
                console.log("Timeseries-Creator finished for date: " + result);
            });
        }
    });
}
