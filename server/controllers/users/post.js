var pg = require('pg');
var jwt = require('jsonwebtoken');
var secret = require('./../../config/secret');
var db_settings = require('../../server.js').db_settings;


// POST
exports.request = function(req, res){

	// TODO
	/* User-Model validation:
		{
			username,
			password,
			email_address,
			first_name,
			last_name
		}
	*/


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
					'user' // User-Role
				], function(err, result) {
				done();

				if(err) {
					return console.error('error running query', err);
				} else {

					// Database Query
					client.query('SELECT * FROM Users WHERE username=$1;', [req.body.username], function(err, result) {
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
								//console.log(user);

								// Send Result
								res.status(200).send(user);
							}
						}
					});
				}
			});
		}
	});

};
