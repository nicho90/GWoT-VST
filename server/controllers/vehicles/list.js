var pg = require('pg');
var _ = require('underscore');
var jwt = require('jsonwebtoken');
var secret = require('./../../config/secret');
var db_settings = require('../../server.js').db_settings;
var errors = require('./../../config/errors');


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

            var category = "";
            var status = true;

            // Check which category was requested
            if (req.query.category) {
                category = "WHERE category=";
                switch (req.query.category) {
                    case 'bike':
                        category += "'BIKE'";
                        break;
                    case 'wheelchair':
                        category += "'WHEELCHAIR'";
                        break;
                    case 'scooter':
                        category += "'SCOOTER'";
                        break;
                    case 'motorbike':
                        category += "'MOTORBIKE'";
                        break;
                    case 'car': {
                        category += "'CAR'";
                        break;
                    }
                    case 'bus': {
                        category += "'BUS'";
                        break;
                    }
                    case 'truck': {
                        category += "'TRUCK'";
                        break;
                    }
                    default: {
                        status = false;
                    }
                }
            }

            // Check if query-parameter was valid
            if(!status) {
                res.status(errors.database.error_3.code).send(errors.database.error_3);
                return console.error(errors.database.error_3.message);
            } else {

                // Database query
                client.query('SELECT * FROM Vehicles ' + category + ';', function(err, result) {
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
        }
    });
};
