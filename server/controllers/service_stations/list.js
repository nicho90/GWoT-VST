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

            var query;
            if(req.query.lng && req.query.lat){
                query = "SELECT " +
                    "service_station_id, " +
                    "ST_Distance(coordinates, ST_GeographyFromText('POINT(" + req.query.lng + " " + req.query.lat + ")')) AS distance, " +
                    "'METER' AS unit, " +
                    "name, " +
                    "phone_number, " +
                    "ST_X(coordinates::geometry) AS lng, " +
                    "ST_Y(coordinates::geometry) AS lat, " +
                    "street, " +
                    "house_number, " +
                    "addition, " +
                    "zip_code, " +
                    "city, " +
                    "country " +
                    "FROM Service_Stations ORDER BY distance ASC LIMIT 5;";
            } else {
                query = "SELECT * FROM Service_Stations;";
            }

            // Database query
            client.query(query, function(err, result) {
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
    });
};