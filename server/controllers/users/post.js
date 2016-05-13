var pg = require('pg');
var jwt = require('jsonwebtoken');
var secret = require('./../../config/secret');
var db_settings = require('../../server.js').db_settings;

var transporter = require('./../../config/email.js').transporter;
var _mailOptions = require('./../../config/email.js').mailOptions;
var path = require('path');
var fs = require('fs');
var mustache = require('mustache');


// POST
exports.request = function(req, res){

	// TODO
	// User-Model validation

	// Create URL
	var url = "postgres://" + db_settings.user + ":" + db_settings.password + "@" + db_settings.host + ":" + db_settings.port + "/" + db_settings.database_name;

	// Connect to Database
	pg.connect(url, function(err, client, done) {
		if(err) {
			console.error('Error fetching client from pool', err);
		} else {

			// Database Query
			client.query('INSERT INTO Users VALUES(now(), now(), $1, $2, $3, $4, $5, $6);',
				[
					req.body.username,
					req.body.password,
					req.body.email_address,
					req.body.first_name,
					req.body.last_name,
					'user' // User-Role (Standard)
				], function(err, result) {
				done();

				if(err) {
					return console.error('error running query', err);
				} else {

					// Database Query
					client.query('SELECT * FROM Users WHERE username=$1;', [
						req.body.username
					], function(err, result) {
						done();

	                    if(err) {
	                        return console.error('error running query', err);
	                    } else {

	                        // Check if user exist
	                        if(result.rows.length === 0) {
	                            res.status(404).send({
	                                'Error': 'User not found'
	                            });
	                        } else {

								// Create Access-Token
	                            var user = result.rows[0];
								user.token = jwt.sign({username: user.username, password: user.password}, secret.key, {
									expiresIn: 1440 // expires in 24 hours
								});


								// Read Template
							    fs.readFile(path.join(__dirname, '../../templates/registration.html'), function (err, data) {
							        if (err) throw err;

									// Render HTML-content
							        var output = mustache.render(data.toString(), user);

									// Create Text for Email-Previews and Email without HTML-support
									var text =
										'Hello ' + user.first_name + ' ' + user.last_name + '\n' +
										'Your new profile ' + user.username + ' has been successfully created!\n\n\n' +
										'APP-NAME - Institute for Geoinformatics (Heisenbergstraße 2, 48149 Münster, Germany)';

									// Set Mail options
									var mailOptions = {
										from: _mailOptions.from,
									    to: user.email_address,
									    subject: 'Registration successful',
									    text: text,
									    html: output
									};

									// Send Email
									transporter.sendMail(mailOptions, function(error, info){
										if(error){
											return console.log(error);
										} else {
											console.log('Message sent: ' + info.response);
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
};
