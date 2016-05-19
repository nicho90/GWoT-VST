var express = require('express');
var router = express.Router();

var list = require('../controllers/emergency_stations/list');
var get = require('../controllers/emergency_stations/get');


// LIST (all or query nearest Emergency Stations by longitude & latitude)
router.get('/emergency_stations', list.request);

// LIST (nearest Emergency Stations of a Sensor)
router.get('/sensors/:sensor_id/emergency_stations', list.request);

// GET
router.get('/emergency_stations/:emergency_station_id', get.request);


module.exports = router;
