var express = require('express');
var router = express.Router();

var list = require('../controllers/service_stations/list');
var get = require('../controllers/service_stations/get');


// LIST
router.get('/service_stations', list.request);

// GET
router.get('/service_stations/:service_station_id', get.request);


module.exports = router;
