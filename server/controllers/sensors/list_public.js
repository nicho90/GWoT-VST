var pg = require('pg');
var types = require('pg').types;
types.setTypeParser(1700, 'text', parseFloat);
var jwt = require('jsonwebtoken');
var secret = require('./../../config/secret');
var db_settings = require('../../server.js').db_settings;


// LIST (PUBLIC)
exports.request = function(req, res){

    // TODO:
    // - addition of admin

	// Create URL
	var url = "postgres://" + db_settings.user + ":" + db_settings.password + "@" + db_settings.host + ":" + db_settings.port + "/" + db_settings.database_name;

	// Connect to Database
	pg.connect(url, function(err, client, done) {
		if(err) {
			res.status(errors.database.error_1.code).send(errors.database.error_1);
			return console.error(errors.database.error_1.message, err);
		} else {

			// Database Query
            client.query('SELECT sensor_id, device_id, description, private, sensor_height, ST_X(coordinates) AS lng, ST_Y(coordinates) AS lat, created, updated FROM Sensors WHERE private=false ORDER BY device_id;', function(err, result) {
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
	});

};
