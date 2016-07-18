/**
 * Weather-Service Creator
 */
var program = require('commander');
var pg = require('pg');
var async = require('async');
var moment = require('moment');
var _ = require('underscore');
var db_settings = require('./config/db').db_settings;
var errors = require('./config/errors');
var forecastio = require('./config/forecastio');

var http = require("http");
var https = require('https');

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

            // Start
            async.waterfall([

                // 1. Get all sensors
                function(callback) {

                    // Database Query
                    client.query("SELECT * FROM Sensors WHERE seasonal=true", function(err, result) {
                        done();

                        if (err) {
                            console.error('Error running query', err);
                            callback(new Error('Error running query', err));
                        } else  {
                            callback(null, result.rows);
                        }
                    });
                },

                // 2. Check weather forecast
                function(sensors, callback){

                    async.each(sensors, function(sensor, callback) {

                        // Create today
                        var now = moment();

                        // Create wet-season-begin
                        var _begin = now.format("YYYY")+ "-" + sensor.wet_season_begin + "-01 00:00:00";
                        var begin = moment(new Date(_begin));

                        // Create wet-season-end
                        var _end = now.format("YYYY")+ "-" + sensor.wet_season_end + "-01 23:59:59";
                        var end = moment(new Date(_end));
                        if(sensor.wet_season_end < sensor.wet_season_begin){
                            end.add(1, 'year');
                        }
                        end = end.endOf('month');

                        console.log(now.format("YYYY-MM-DD HH:mm:ss") + "? " + begin.format("YYYY-MM-DD HH:mm:ss") + " - " + end.format("YYYY-MM-DD HH:mm:ss"));

                        // Check if today is in the wet season
                        if(now.isBetween(begin, end)){

                            // Create URL
                            var url = 'https://api.forecast.io/forecast/' + forecastio.accessToken + '/' + sensor.lat + ',' + sensor.lng + '?units=' + forecastio.units + '&lang=en';

            				// Request Forecast.io
            				https.get(url, function(response){
            				    var body = '';

            				    response.on('data', function(chunk){
            				        body += chunk;
            				    });

            				    response.on('end', function(){
            				        var result = JSON.parse(body);

                                    var weather;
                                    if(result.currently.icon == 'rain'){
                                        weather = true;
                                    } else if(result.currently.icon == 'snow') {
                                        weather = true;
                                    } else if(result.currently.icon == 'hail') {
                                        weather = true;
                                    } else if(result.currently.icon == 'thunderstorm') {
                                        weather = true;
                                    } else {
                                        weather = false;
                                    }

                                    var query;

                                    // Check if frequency is already increased or increased by the sensor-threshold
                                    if(weather){
                                        query = "UPDATE Sensors SET " +
                                                "increased_frequency=true, " +
                                                "triggered_weather=true " +
                                            "WHERE sensor_id=$1;";
                                    } else {
                                        if(sensor.triggered_threshold){
                                            query = "UPDATE Sensors SET " +
                                                    "increased_frequency=true, " +
                                                    "triggered_weather=false " +
                                                "WHERE sensor_id=$1;";
                                        } else {
                                            query = "UPDATE Sensors SET " +
                                                    "increased_frequency=false, " +
                                                    "triggered_weather=false " +
                                                "WHERE sensor_id=$1;";
                                        }
                                    }

                                    // Database Query
                                    client.query(query, [
                                        sensor.sensor_id
                                    ], function(err, result) {
                                        done();

                                        if (err) {
                                            console.error('Error running query', err);
                                            callback(new Error('Error running query', err));
                                        } else  {
                                            callback(null, now.format("YYYY-MM-DD HH:mm:ss"));
                                        }
                                    });

            				    });
            				}).on('error', function(err){
                                console.error(err);
            					callback(err);
                            });
                        } else {
                            callback(new Error("Today is not in the wet season"));
                        }

                    }, function(err){
                        callback(null, now.format("YYYY-MM-DD HH:mm:ss"));
                    });
                }
            ], function(err, result) {
                if(err){
                    console.error(err);
                } else {
                    console.log("Weather-Service finished for date: " + result);
                }
            });
        }
    });
}
