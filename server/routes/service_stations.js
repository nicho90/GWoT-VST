var express = require('express');
var router = express.Router();

var list = require('../controllers/service_stations/list');
var get = require('../controllers/service_stations/get');


// LIST (all or query nearest Service Stations by longitude & latitude)
router.get('/service_stations', list.request);

// LIST (nearest Service Stations of a Sensor)
router.get('/sensors/:sensor_id/service_stations', list.request);

// GET
router.get('/service_stations/:service_station_id', get.request);


module.exports = router;
