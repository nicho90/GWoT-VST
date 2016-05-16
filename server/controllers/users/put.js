var pg = require('pg');
var jwt = require('jsonwebtoken');
var secret = require('./../../config/secret');
var verifier = require('./../../config/verifier');
var db_settings = require('../../server.js').db_settings;


// PUT
exports.request = function(req, res){

	// Decode Token
	jwt.verify(req.headers.token, secret.key, function(err, decoded) {
		if (err) {
			res.status(401).json({
				message: 'Failed to authenticate with this token'
			});
        } else {

			// Further token valiation
			var validation = verifier(decoded, req.params.username);
			console.log(validation);

			if(!validation.success) {
				res.status(401).json({
					message: validation.message
				});
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
						client.query('SELECT * FROM Users WHERE username=$1;', [
							req.params.username
						], function(err, result) {
							done();

							if(err) {
								res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
								return console.error(errors.database.error_2.message, err);
							} else {

								// Check if user exist
								if(result.rows.length === 0) {
									res.status(404).send({
										message: 'User not found'
									});
								} else {

									// Prepare Query
									var query = "UPDATE Users SET " +
										"updated=now(), " +
										"username=($1), " +
										"password=($2), " +
										"email_address=($3), " +
										"first_name=($4), " +
										"last_name=($5) " +
										"WHERE username=($6);";

									// Database Query
									client.query(query, [
										req.body.username,
										req.body.password,
										req.body.email_address,
										req.body.first_name,
										req.body.last_name,
										req.params.username
									], function(err, result) {
										done();

										if(err) {
											res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
											return console.error(errors.database.error_2.message, err);
										} else {

											// Database Query
											client.query('SELECT created, updated, username, password, email_address, first_name, last_name FROM Users WHERE username=$1;', [
												req.body.username
											], function(err, result) {
												done();

												if(err) {
													res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
													return console.error(errors.database.error_2.message, err);
												} else {

													// Attach Access-Token
													var user = result.rows[0];
													user.token = req.headers.token;

													// Send Result
													res.status(200).send(user);
												}
											});
										}
									});
								}
							}
						});
					}
				});
			}
		}
	});
};
