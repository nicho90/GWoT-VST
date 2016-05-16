var pg = require('pg');
var _ = require('underscore');
var jwt = require('jsonwebtoken');
var secret = require('./../../config/secret');
var db_settings = require('../../server.js').db_settings;
var errors = require('./../../config/errors');
var verifier = require('./../../config/verifier');


// DELETE
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

								// Check if user exists
								if(result.rows.length === 0) {
									res.status(404).send({
										message: 'User not found'
									});
								} else {

									// Database Query
									client.query("DELETE FROM Users WHERE username=$1;", [
										req.params.username,
									], function(err, result) {
										done();

										if(err) {
											res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
											return console.error(errors.database.error_2.message, err);
										} else {

											// Send Result
											res.status(204).send();
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
