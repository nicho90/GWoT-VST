var pg = require('pg');
var _ = require('underscore');
var jwt = require('jsonwebtoken');
var secret = require('./../../config/secret');
var db = require('./../../config/db');
var db_settings = require('../../server.js').db_settings;
var errors = require('./../../config/errors');

var transporter = require('./../../config/email.js').transporter;
var _mailOptions = require('./../../config/email.js').mailOptions;
var path = require('path');
var fs = require('fs');
var mustache = require('mustache');

var Ajv = require('ajv');
var schema = require('./../../models/user');
var ajv = Ajv({"format": "full"});
var validate = ajv.compile(schema);


// POST
exports.request = function(req, res) {

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
	        if (err) {
				res.status(errors.database.error_1.code).send(errors.database.error_1);
				return console.error(errors.database.error_1.message, err);
	        } else {

	            // Database Query
	            client.query('INSERT INTO Users VALUES(now(), now(), $1, $2, $3, $4, $5, $6, $7);', [
	                req.body.username,
	                req.body.password,
	                req.body.email_address,
	                req.body.first_name,
	                req.body.last_name,
	                req.body.language,
	                'user' // User-Role (Default)
	            ], function(err, result) {
	                done();

	                if (err) {
	                    res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
						return console.error(errors.database.error_2.message, err);
	                } else {

	                    // Database Query
	                    client.query('SELECT * FROM Users WHERE username=$1;', [
	                        req.body.username
	                    ], function(err, result) {
	                        done();

	                        if (err) {
								res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
								return console.error(errors.database.error_2.message, err);
	                        } else {

	                            // Check if User exists
	                            if (result.rows.length === 0) {
									res.status(errors.query.error_1.code).send(errors.query.error_1);
									return console.error(errors.query.error_1.message);
	                            } else {

	                                // Create and attach Access-Token
	                                var user = result.rows[0];
	                                user.token = jwt.sign({
	                                    username: user.username,
	                                    password: user.password
	                                }, secret.key, {
	                                    expiresIn: 1440 // expires in 24 hours
	                                });


	                                // Read Template
	                                fs.readFile(path.join(__dirname, '../../templates/registration.html'), function(err, data) {
	                                    if (err) throw err;

	                                    // Render HTML-content
	                                    var output = mustache.render(data.toString(), user);

	                                    // Create Text for Email-Previews and Email without HTML-support
	                                    var text =
	                                        'Hello ' + user.first_name + ' ' + user.last_name + '\n' +
	                                        'Your new profile ' + user.username + ' has been successfully created!\n\n\n' +
	                                        'GWoT-VST - Institute for Geoinformatics (Heisenbergstraße 2, 48149 Münster, Germany)';

	                                    // Set Mail options
	                                    var mailOptions = {
	                                        from: _mailOptions.from,
	                                        to: user.email_address,
	                                        subject: 'Registration successful',
	                                        text: text,
	                                        html: output
	                                    };

	                                    // Send Email
	                                    transporter.sendMail(mailOptions, function(error, info) {
	                                        if (error) {
	                                            return console.log(error);
	                                        } else {
	                                            console.log('Email has been sent: ' + info.response);
	                                        }
	                                    });
	                                });

	                                // Send Result
	                                res.status(201).send(user);
	                            }
	                        }
	                    });
	                }
	            });
	        }
	    });
	}
};
