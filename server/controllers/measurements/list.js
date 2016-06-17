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
            var singleData = false;
            if (req.query.latest) {
                query = "SELECT * FROM Measurements WHERE sensor_id=$1 ORDER BY measurement_timestamp DESC LIMIT 1;";
                singleData = true;
            } else if (req.query.maximum) {
                query = "SELECT * FROM Measurements WHERE sensor_id=$1 ORDER BY distance DESC LIMIT 1;";
                singleData = true;
            } else if (req.query.minimum) {
                query = "SELECT * FROM Measurements WHERE sensor_id=$1 ORDER BY distance ASC LIMIT 1;";
                singleData = true;
            } else {
                query = "SELECT * FROM Measurements WHERE sensor_id=$1 ORDER BY measurement_timestamp DESC LIMIT 1000;";
            }

            // Database Query
            client.query(query, [
                req.params.sensor_id
            ], function(err, result) {
                done();

                if (err) {
                    res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
                    return console.error(errors.database.error_2.message, err);
                } else {

                    // Send Result
                    if (singleData) {
                        res.status(200).send(result.rows[0]);
                    } else {
                        res.status(200).send(result.rows);
                    }

                }
            });
        }
    });

};
