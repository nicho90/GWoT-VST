var pg = require('pg');
var types = require('pg').types;
types.setTypeParser(1700, 'text', parseFloat);
var moment = require('moment');
var _ = require('underscore');
var jwt = require('jsonwebtoken');
var secret = require('./../../config/secret');
var db_settings = require('../../server.js').db_settings;
var errors = require('./../../config/errors');
var verifier = require('./../../config/verifier');


// LIST
exports.request = function(req, res){

	// Create URL
	var url = "postgres://" + db_settings.user + ":" + db_settings.password + "@" + db_settings.host + ":" + db_settings.port + "/" + db_settings.database_name;

	// Connect to Database
	pg.connect(url, function(err, client, done) {
		if(err) {
			res.status(errors.database.error_1.code).send(errors.database.error_1);
			return console.error(errors.database.error_1.message, err);
		} else {

			// TODO: Check if Sensor exists

			// PostgreSQL-timestamp: "2016-05-17 00:20:53.248363+02"
			var now = moment();
			var begin = "";
			var end = moment().format("YYYY-MM-DD hh:mm:ss");

			// Check for queries
			if(_.isEmpty(req.query)) {

				// Database Query
				client.query("SELECT * FROM Timeseries WHERE sensor_id=$1;", [
					req.params.sensor_id
				], function(err, result) {
	                done();

	                if(err) {
						res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
						return console.error(errors.database.error_2.message, err);
	                } else {

	                    // Send Result
	                    res.status(200).send(result.rows);
	                }
	            });

			} else {

				var query;
				if(req.query.hours){
					begin = now.subtract(req.query.hours, 'hours').format("YYYY-MM-DD hh:mm:ss");
					query = "SELECT * FROM Measurements WHERE sensor_id=$1 AND measurement_timestamp >=$2 ORDER BY measurement_timestamp ASC;";
				} else if(req.query.days) {
					begin = now.subtract(req.query.days, 'days').format("YYYY-MM-DD hh:mm:ss");
					query = "SELECT * FROM Timeseries WHERE sensor_id=$1 AND measurement_date >=$2 ORDER BY measurement_date ASC;";
				} else if(req.query.weeks) {
					begin = now.subtract(req.query.weeks, 'weeks').format("YYYY-MM-DD hh:mm:ss");
					query = "SELECT * FROM Timeseries WHERE sensor_id=$1 AND measurement_date >=$2 ORDER BY measurement_date ASC;";
				} else if(req.query.months) {
					begin = now.subtract(req.query.months, 'months').format("YYYY-MM-DD hh:mm:ss");
					query = "SELECT * FROM Timeseries WHERE sensor_id=$1 AND measurement_date >=$2 ORDER BY measurement_date ASC;";
				} else if(req.query.years) {
					begin = now.subtract(req.query.years, 'years').format("YYYY-MM-DD hh:mm:ss");
					query = "SELECT * FROM Timeseries WHERE sensor_id=$1 AND measurement_date >=$2 ORDER BY measurement_date ASC;";
				} else {
					res.status(errors.database.error_3.code).send(_.extend(errors.database.error_3));
					return console.error(errors.database.error_3.message);
				}

				// Database Query
				client.query(query, [
					req.params.sensor_id,
					begin
				], function(err, result) {
	                done();

	                if(err) {
						res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
						return console.error(errors.database.error_2.message, err);
	                } else {

	                    // Send Result
	                    res.status(200).send(result.rows);
	                }
	            });
			}
		}
	});
};
