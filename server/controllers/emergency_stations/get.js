var pg = require('pg');
var types = require('pg').types;
types.setTypeParser(1700, 'text', parseFloat);
var _ = require('underscore');
var jwt = require('jsonwebtoken');
var secret = require('./../../config/secret');
var db_settings = require('../../server.js').db_settings;
var errors = require('./../../config/errors');


// GET
exports.request = function(req, res) {

    // Create URL
    var url = "postgres://" + db_settings.user + ":" + db_settings.password + "@" + db_settings.host + ":" + db_settings.port + "/" + db_settings.database_name;

    // Connect to Database
    pg.connect(url, function(err, client, done) {
        if (err) {
            res.status(errors.database.error_1.code).send(errors.database.error_1);
            return console.error(errors.database.error_1.message, err);
        } else {

            // Database query
            client.query('SELECT * FROM Emergency_Stations WHERE emergency_station_id=$1;', [
                req.params.emergency_station_id
            ], function(err, result) {
                done();

                if (err) {
                    res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
                    return console.error(errors.database.error_2.message, err);
                } else {

                    // Check if Emergency-Station exists
                    if(result.rows.length === 0) {
                        res.status(errors.query.error_13.code).send(errors.query.error_13);
                        return console.error(errors.query.error_13.message);
                    } else {

                        // Send Result
                        res.status(200).send(result.rows[0]);
                    }
                }
            });
        }
    });
};
