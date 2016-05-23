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

if(program.postgres_user != "admin" && program.postgres_password != "password"){
    db_settings.status = true;
    db_settings.user = program.postgres_user;
    db_settings.password = program.postgres_password;
}

// Check if Database-Settings were submitted
if(!db_settings.status){
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
                function (callback) {

                    // Database Query
                    client.query("SELECT (sensor_id) FROM Sensors", function(err, result) {
                        done();

                        if (err) {
                            return console.error('Error running query', err);
                        } else {
                            callback(null, result.rows);
                        }
                    });
                },
                function (sensors, callback) {

                    // PostgreSQL-timestamp: "2016-05-17 00:20:53.248363+02"
                    var yesterday = moment().add(-1, 'days');
                    var begin = yesterday.format("YYYY-MM-DD") + " 00:00:00";
                    var _begin = yesterday.format("YYYY-MM-DD");
                    var end = yesterday.format("YYYY-MM-DD") + " 23:59:59";

                    //console.log(begin);
                    //console.log(end);

                    async.each(sensors, function (sensor, callback) {

                        // Database Query
                        client.query("SELECT AVG(distance) FROM Measurements WHERE sensor_id=$1 AND created >=$2 AND created <=$3;", [
                            sensor.sensor_id,
                            begin,
                            end
                        ], function(err, result) {
                            done();

                            if (err) {
                                return console.error('Error running query', err);
                            } else {

                                if(result.rows[0].avg !== null){

                                    // Database Query
                                    client.query("INSERT INTO Timeseries (created, updated, sensor_id, distance, water_level, measurement_date) VALUES (now(), now(), $1, $2, $3, $4);", [
                                        sensor.sensor_id,
                                        result.rows[0].avg,
                                        sensor.sensor_height-result.rows[0].avg,
                                        _begin
                                    ], function(err, result) {
                                        done();

                                        if (err) {
                                            return console.error('Error running query', err);
                                        } else {
                                            callback(null);
                                        }
                                    });
                                } else {
                                    console.log("No distances found for Sensor-Id '" + sensor.sensor_id + "'!");
                                    callback(null);
                                }
                            }
                        });
                    }, function (err) {
                        if (err) {
                            console.error(err.message);
                        } else {
                            callback(null);
                        }
                    });
                }
            ], function(result){
                console.log("Time-Series created!");
            });
        }
    });
}
