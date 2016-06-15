var pg = require('pg');
var _ = require('underscore');
var jwt = require('jsonwebtoken');
var secret = require('./../../config/secret');
var db_settings = require('../../server.js').db_settings;
var errors = require('./../../config/errors');
var verifier = require('./../../config/verifier');


// DELETE
exports.request = function(req, res){

    // Check if User was authenticated
	if(!req.headers.authorization || req.headers.authorization === ""){
		res.status(errors.authentication.error_3.code).send(errors.authentication.error_3);
		return console.error(errors.authentication.error_3.message);
	} else {

		// Decode Token
		jwt.verify(req.headers.authorization, secret.key, function(err, decoded) {
			if (err) {
				res.status(errors.authentication.error_2.code).send(errors.authentication.error_2);
				return console.error(errors.authentication.error_2.message);
			} else {

				// Get username from authenticated user
				var username = decoded.username;

				// Check if authenticated user is the right user or admin
				if(username === req.params.username || username === db.admin) {

					// Database Query
					client.query('SELECT * FROM Users WHERE username=$1;', [
						req.params.username
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

                                // Database Query
            					client.query('DELETE FROM Users WHERE username=$1;', [
            						req.params.username
            					], function(err, result) {
            						done();

            						if(err) {
            							res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
            							return console.error(errors.database.error_2.message, err);
            						} else {

            							// Send result
            							res.status(204).send();
            						}
            					});
							}
						}
					});
				} else {
					res.status(errors.authentication.error_2.code).send(errors.authentication.error_2);
					return console.error(errors.authentication.error_2.message);
				}
			}
		});
	}
};
