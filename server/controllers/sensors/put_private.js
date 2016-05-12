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
						console.error('Error fetching client from pool', err);
					} else {

						// Database Query
						client.query('SELECT * FROM Sensors WHERE created_by=$1 AND sensor_id=$2;', [
							req.params.username,
							req.params.sensor_id
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

								// Check if user exist
								if(result.rows.length === 0) {
									res.status(404).send({
										message: 'Sensor not found'
									});
								} else {

									// Prepare Query
									var query = "UPDATE Sensors SET " +
										"updated=now(), " +
										"device_id=($1), " +
										"description=($2), " +
										"private=($3), " +
										"sensor_height=($4) " +
										"WHERE created_by=$5 AND sensor_id=$6;";

									// Database Query
									client.query(query, [
										req.body.device_id,
										req.body.description,
										req.body.private,
										req.body.sensor_height,
										req.params.username,
										req.params.sensor_id
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
											client.query('SELECT sensor_id, device_id, description, private, sensor_height, ST_X(coordinates) AS lng, ST_Y(coordinates) AS lat, created, updated FROM Sensors WHERE created_by=$1 AND sensor_id=$2;', [
												req.params.username,
												req.params.sensor_id
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

													// Check if sensor exist
													if(result.rows.length === 0) {
														res.status(404).send({
															message: 'Sensor not found'
														});
													} else {

														// Send Result
														res.status(200).send(result.rows[0]);
													}
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
