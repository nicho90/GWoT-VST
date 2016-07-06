var pg = require('pg');
var types = require('pg').types;
types.setTypeParser(1700, 'text', parseFloat);
var _ = require('underscore');
var jwt = require('jsonwebtoken');
var secret = require('./../../config/secret');
var db = require('./../../config/db');
var db_settings = require('../../server.js').db_settings;
var errors = require('./../../config/errors');
var async = require('async');


// GET
exports.request = function(req, res) {

	// Create URL
	var url = "postgres://" + db_settings.user + ":" + db_settings.password + "@" + db_settings.host + ":" + db_settings.port + "/" + db_settings.database_name;

	// Connect to Database
	pg.connect(url, function(err, client, done) {
		if(err) {
			res.status(errors.database.error_1.code).send(errors.database.error_1);
			return console.error(errors.database.error_1.message, err);
		} else {

			// Start pipeline
            async.waterfall([

                // 1. Check if Sensor exists
                function(callback) {

					// Database Query
		            client.query('SELECT * FROM Sensors WHERE sensor_id=$1;', [
		                req.params.sensor_id
		            ], function(err, result) {
		                done();

		                if(err) {
		                    res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
		                    return console.error(errors.database.error_2.message, err);
		                } else {

		                    // Check if Sensor exists
		                    if(result.rows.length === 0) {
		                        res.status(errors.query.error_2.code).send(errors.query.error_2);
		                        return console.error(errors.query.error_2.message);
		                    } else {
								callback(null, result.rows[0]);
							}
						}
					});
                },
				// 2. Build statistics
                function(sensor, callback) {

					// Prepare result-object
					var statistics = {};

					async.parallel([

						// 2.1 Get the average of the water-level
						function(callback){

							// Database Query
							client.query("SELECT AVG(water_level) AS avg_water_level, 'CENTIMETER' AS avg_water_level_unit FROM Timeseries WHERE sensor_id=$1;", [
								req.params.sensor_id
							], function(err, result) {
								done();

								if(err) {
									res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
									return console.error(errors.database.error_2.message, err);
								} else {

									if(result.rows[0].avg_water_level === null){
										statistics.average = {
											avg_water_level: "-",
											avg_water_level_unit: "CENTIMETER"
										};
									} else {
										statistics.average = result.rows[0];
									}
									callback(null, null);
								}
							});
						},
						// 2.2 Get the standard deviation of the water-level
						function(callback){

							// Database Query
							client.query("SELECT STDDEV(water_level) AS std_water_level, 'CENTIMETER' AS std_water_level_unit FROM Timeseries WHERE sensor_id=$1;", [
								req.params.sensor_id
							], function(err, result) {
								done();

								if(err) {
									res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
									return console.error(errors.database.error_2.message, err);
								} else {
									if(result.rows[0].std_water_level === null){
										statistics.std = {
											std_water_level: "-",
											std_water_level_unit: "CENTIMETER"
										};
									} else {
										statistics.std = result.rows[0];
									}
									callback(null, null);
								}
							});
						},
						// 2.2. Get the minimum (ordered by latest measurement)
						function(callback){

							async.waterfall([

								// Get minimum in Timeseries
								function(callback){

									// Database Query
									client.query("SELECT MIN(water_level) AS minimum FROM Timeseries WHERE sensor_id=$1 AND valid_data=true;", [
										req.params.sensor_id
									], function(err, result) {
										done();

										if(err) {
											res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
											return console.error(errors.database.error_2.message, err);
										} else {
											callback(null, result.rows[0].minimum);
										}
									});
								},
								// Get minimum in Timeseries with date (full row)
								function(ts_minimum, callback){

									// Check if a minimum in Timeseries was found
									if(ts_minimum !== null){

										// Database Query
										client.query("SELECT " +
											    "created, " +
											    "updated, " +
											    "water_level, " +
												"'CENTIMETER' AS water_level_unit, " +
											    "measurement_date, " +
												"true AS valid_entry " +
										 	"FROM " +
												"( " +
													"SELECT * FROM Timeseries " +
													"WHERE sensor_id=$1 AND valid_data=true AND water_level=$2" +
												") AS timeseries ORDER BY measurement_date DESC LIMIT 1;", [
											req.params.sensor_id,
											ts_minimum
										], function(err, result) {
											done();

											if(err) {
												res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
												return console.error(errors.database.error_2.message, err);
											} else {
												statistics.minimum = result.rows[0];
												callback(null, null);
											}
										});

									} else {

										async.waterfall([

											// Get minimum in Measurement
											function(callback){

												// Database Query
												client.query("SELECT MIN(water_level) AS minimum FROM Measurements WHERE sensor_id=$1;", [
													req.params.sensor_id
												], function(err, result) {
													done();

													if(err) {
														res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
														return console.error(errors.database.error_2.message, err);
													} else {
														callback(null, result.rows[0].minimum);
													}
												});
											},
											// Get minimum in Measurements with date (full row)
											function(ms_minimum, callback){

												// Check if a minimum in Measurements was found
												if(ms_minimum !== null){

													// Database Query
													client.query("SELECT * FROM " +
														"( " +
															"SELECT * FROM Measurements " +
															"WHERE sensor_id=$1 AND water_level=$2" +
														") AS measurements ORDER BY measurement_timestamp DESC LIMIT 1;", [
														req.params.sensor_id,
														ms_minimum
													], function(err, result) {
														done();

														if(err) {
															res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
															return console.error(errors.database.error_2.message, err);
														} else {
															statistics.minimum = result.rows[0];
															callback(null, null);
														}
													});

												} else {

													var min = {
  														water_level: "-",
  														water_level_unit: "CENTIMETER",
  														measurement_date: "-",
  														valid_data: false
													};
													statistics.minimum = min;
													callback(null, null);
												}
											}
										],
										function(err, results){
											if(err){
												callback(err);
											} else {
												callback(null, null);
											}
										});
									}
								}
							],
							function(err, results){
								if(err){
									callback(err);
								} else {
									callback(null, null);
								}
							});
						},
						// 2.3. Get the maximum (ordered by latest measurement)
						function(callback){

							async.waterfall([

								// Get maximum in Timeseries
								function(callback){

									// Database Query
									client.query("SELECT MAX(water_level) AS maximum FROM Timeseries WHERE sensor_id=$1 AND valid_data=true;", [
										req.params.sensor_id
									], function(err, result) {
										done();

										if(err) {
											res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
											return console.error(errors.database.error_2.message, err);
										} else {
											callback(null, result.rows[0].maximum);
										}
									});
								},
								// Get maximum in Timeseries with date (full row)
								function(ts_maximum, callback){

									console.log("ts_maximum");
									console.log(ts_maximum);

									// Check if a maximum in Timeseries was found
									if(ts_maximum !== null){

										// Database Query
										client.query("SELECT " +
												"created, " +
												"updated, " +
												"water_level, " +
												"'CENTIMETER' AS water_level_unit, " +
												"measurement_date, " +
												"true AS valid_entry " +
											"FROM " +
												"( " +
													"SELECT * FROM Timeseries " +
													"WHERE sensor_id=$1 AND water_level=$2 AND valid_data=true " +
												") AS timeseries ORDER BY measurement_date DESC LIMIT 1;", [
											req.params.sensor_id,
											ts_maximum
										], function(err, result) {
											done();

											if(err) {
												res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
												return console.error(errors.database.error_2.message, err);
											} else {
												statistics.maximum = result.rows[0];
												callback(null, null);
											}
										});

									} else {

										async.waterfall([

											// Get maximum in Measurement
											function(callback){

												// Database Query
												client.query("SELECT MAX(water_level) AS maximum FROM Measurements WHERE sensor_id=$1;", [
													req.params.sensor_id
												], function(err, result) {
													done();

													if(err) {
														res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
														return console.error(errors.database.error_2.message, err);
													} else {
														callback(null, result.rows[0].maximum);
													}
												});
											},
											// Get maximum in Measurements with date (full row)
											function(ms_maximum, callback){

												console.log("ms_maximum");
												console.log(ms_maximum);

												// Check if a maximum in Measurements was found
												if(ms_maximum !== null){

													// Database Query
													client.query("SELECT * FROM " +
														"( " +
															"SELECT * FROM Measurements " +
															"WHERE sensor_id=$1 AND water_level=$2" +
														") AS measurements ORDER BY measurement_timestamp DESC LIMIT 1;", [
														req.params.sensor_id,
														ms_maximum
													], function(err, result) {
														done();

														if(err) {
															res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
															return console.error(errors.database.error_2.message, err);
														} else {
															statistics.maximum = result.rows[0];
															callback(null, null);
														}
													});

												} else {

													var max = {
  														water_level: "-",
  														water_level_unit: "CENTIMETER",
  														measurement_date: "-",
														valid_entry: false
													};
													statistics.maximum = max;
													callback(null, null);
												}
											}
										],
										function(err, results){
											if(err){
												callback(err);
											} else {
												callback(null, null);
											}
										});
									}
								}
							],
							function(err, results){
								if(err){
									callback(err);
								} else {
									callback(null, null);
								}
							});
						}
					],
					function(err, results){
						if(err){
							console.log(err);
						} else {
							callback(null, statistics);
						}
					});
				}
			], function(err, results) {
	            if (err) {
	            	console.log(err);
	            } else {

					// Send results
					res.status(200).send(results);
	            }
	        });
		}
	});
};
