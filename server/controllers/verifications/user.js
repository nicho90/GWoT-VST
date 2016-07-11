var pg = require('pg');
var db = require('./../../config/db');
var db_settings = require('../../server.js').db_settings;
var errors = require('./../../config/errors');


// VERIFY USERNAME
exports.request = function(req, res) {

    // Create URL
    var url = "postgres://" + db_settings.user + ":" + db_settings.password + "@" + db_settings.host + ":" + db_settings.port + "/" + db_settings.database_name;

    // Connect to Database
    pg.connect(url, function(err, client, done) {
        if (err) {
            res.status(errors.database.error_1.code).send(errors.database.error_1);
            return console.error(errors.database.error_1.message, err);
        } else {

            // Check username was send
            if(req.query.username && req.query.username !== ""){

                // Database query
                client.query('SELECT * FROM Users WHERE username=$1;', [
                    req.query.username
                ], function(err, result) {
                    done();

                    if (err) {
                        res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
                        return console.error(errors.database.error_2.message, err);
                    } else {

                        // Check if username exists
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
