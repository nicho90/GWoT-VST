var express = require('express');
var router = express.Router();

var list = require('../controllers/emergency_stations/list');
var get = require('../controllers/emergency_stations/get');


// LIST
router.get('/emergency_stations', list.request);

// GET
router.get('/emergency_stations/:emergency_station_id', get.request);


module.exports = router;
