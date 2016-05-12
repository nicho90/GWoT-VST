var pg = require('pg');
var types = require('pg').types;
types.setTypeParser(1700, 'text', parseFloat);
var jwt = require('jsonwebtoken');
var secret = require('./../../config/secret');
var verifier = require('./../../config/verifier');
var db_settings = require('../../server.js').db_settings;


// POST
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

				// TODO
				// Model-Validation

				// Create URL
				var url = "postgres://" + db_settings.user + ":" + db_settings.password + "@" + db_settings.host + ":" + db_settings.port + "/" + db_settings.database_name;

				// Connect to Database
				pg.connect(url, function(err, client, done) {
					if(err) {
						console.error('Error fetching client from pool', err);
					} else {

						// Database Query
						client.query("INSERT INTO Sensors (created, updated, created_by, device_id, description, private, coordinates, sensor_height) VALUES (now(), now(), $1, $2, $3, $4, ST_GeomFromText('POINT(" + req.body.lat + " " + req.body.lng + ")', 4326), $5);",
							[
								req.params.username,
								req.body.device_id,
								req.body.description,
								req.body.private,
								req.body.sensor_height
							], function(err, result) {
							done();

							if(err) {
								console.error('Error running query: ', err);
								res.status(401).json({
									message: 'Error running query',
									error: err
								});
								return;
							} else {

								// Database Query
								client.query('SELECT sensor_id, device_id, description, private, sensor_height, ST_X(coordinates) AS lng, ST_Y(coordinates) AS lat, created, updated FROM Sensors WHERE created_by=$1 ORDER BY created DESC;', [
									req.params.username
								], function(err, result) {
									done();

				                    if(err) {
										console.error('Error running query: ', err);
										res.status(401).json({
											message: 'Error running query',
											error: err
										});
										return;
				                    } else {

										// Send Result
										res.status(201).send(result.rows[0]);
									}
								});
							}
						});
					}
				});
			}
		}
	});
};
