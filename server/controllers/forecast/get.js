var moment = require('moment');
var _ = require('underscore');
var errors = require('./../../config/errors');
var forecastio = require('./../../config/forecastio');

var http = require("http");
var https = require('https');


// GET
exports.request = function(req, res){

	// Check if parameters were sent
	if(req.query.lat) {
		if(req.query.lng) {
			if(req.query.lang) {

				var url = 'https://api.forecast.io/forecast/' + forecastio.accessToken + '/' + req.query.lat + ',' + req.query.lng + '?units=' + forecastio.units + '&lang=' + req.query.lang;

				// Request Forecast.io
				https.get(url, function(response){
				    var body = '';

				    response.on('data', function(chunk){
				        body += chunk;
				    });

				    response.on('end', function(){
				        var result = JSON.parse(body);

						// Send results
			            res.status(200).send(result);
				    });
				}).on('error', function(err){
					console.error(err);
					res.status(errors.query.error_11.code).send(errors.query.error_11.message);
				});

			} else {
				res.status(errors.query.error_11.code).send(errors.query.error_11.message);
			}
		} else {
			res.status(errors.query.error_10.code).send(errors.query.error_10.message);
		}
	} else {
		res.status(errors.query.error_9.code).send(errors.query.error_9.message);
	}
};
