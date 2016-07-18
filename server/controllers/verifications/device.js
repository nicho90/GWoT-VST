var pg = require('pg');
var db = require('./../../config/db');
var db_settings = require('../../server.js').db_settings;
var errors = require('./../../config/errors');


// VERIFY DEVICE-ID
exports.request = function(req, res) {

    // Create URL
    var url = "postgres://" + db_settings.user + ":" + db_settings.password + "@" + db_settings.host + ":" + db_settings.port + "/" + db_settings.database_name;

    // Connect to Database
    pg.connect(url, function(err, client, done) {
        if (err) {
            res.status(errors.database.error_1.code).send(errors.database.error_1);
            return console.error(errors.database.error_1.message, err);
        } else {

            // Check device_id was send
            if(req.query.device_id && req.query.device_id !== ""){

                // Database query
                client.query('SELECT * FROM Sensors WHERE device_id=$1;', [
                    req.query.device_id
                ], function(err, result) {
                    done();

                    if (err) {
                        res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
                        return console.error(errors.database.error_2.message, err);
                    } else {

                        // Check if device_id exists
                        if(result.rows.length === 0){

                            // Send Result
                            res.status(200).send(true);
                        } else {

                            // Send Result
                            res.status(200).send(false);
                        }
                    }
                });

            } else {
                // TODO:
                res.status(200).send(false);
            }
        }
    });
};
