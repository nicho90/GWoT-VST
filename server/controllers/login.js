var pg = require('pg');
var _ = require('underscore');
var jwt = require('jsonwebtoken');
var secret = require('./../config/secret');
var db_settings = require('../server.js').db_settings;
var errors = require('./../config/errors');

var Ajv = require('ajv');
var schema = require('./../models/login');
var ajv = Ajv({"format": "full"});
var validate = ajv.compile(schema);


// POST
exports.request = function(req, res){

    // Schema Validation
    var valid = validate(req.body);
    if (!valid) {
        res.status(errors.schema.error_1.code).send(_.extend(errors.schema.error_1, {
            err: validate.errors[0].dataPath + ": " + validate.errors[0].message
        }));
        return console.error(validate.errors[0].dataPath + ": " + validate.errors[0].message);
    } else {

        // Create URL
        var url = "postgres://" + db_settings.user + ":" + db_settings.password + "@" + db_settings.host + ":" + db_settings.port + "/" + db_settings.database_name;

        // Connect to Database
        pg.connect(url, function(err, client, done) {
            if(err) {
                res.status(errors.database.error_1.code).send(errors.database.error_1);
    			return console.error(errors.database.error_1.message, err);
            } else {

                // Database Query
                client.query('SELECT * FROM users WHERE username=$1;', [
                    req.body.username
                ], function(err, result) {
                    done();

                    if(err) {
                        res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
                        return console.error(errors.database.error_2.message, err);
                    } else {

                        // Check if User exists
                        if(result.rows.length === 0) {
                            res.status(errors.query.error_1.code).send(errors.query.error_1);
                            return console.error(errors.query.error_1.message);
                        } else {

                            // Prepare result
                            var user = result.rows[0];

                            // Validate password
                            if(user.password == req.body.password){

                                // Create Access-Token
                                user.token = jwt.sign({username: user.username, password: user.password}, secret.key, {
                                    expiresIn: '1d' // Default: 1 day
                                });

                                // Send result
                                res.status(200).send(user);

                            } else {
                                res.status(errors.authentication.error_1.code).send(errors.authentication.error_1);
                                return console.error(errors.authentication.error_1.message);
                            }
                        }
                    }
                });
            }
        });
    }
};
