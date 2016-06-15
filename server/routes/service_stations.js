var express = require('express');
var router = express.Router();

var list = require('../controllers/service_stations/list');
var get = require('../controllers/service_stations/get');
var post = require('../controllers/service_stations/post');
var put = require('../controllers/service_stations/put');
var del = require('../controllers/service_stations/delete');
var delete_all = require('../controllers/service_stations/delete_all');

var list_sensor = require('../controllers/service_stations/list_sensor');


// LIST (all or query nearest Service Stations by longitude & latitude)
router.get('/service_stations', list.request);

// POST
router.post('/service_stations', post.request);

// GET
router.get('/service_stations/:service_station_id', get.request);

// PUT
router.put('/service_stations/:service_station_id', put.request);

// DELETE
router.delete('/service_stations/:service_station_id', del.request);

// DELETE ALL
router.delete('/service_stations', delete_all.request);


// LIST (nearest Service Stations of a Sensor)
router.get('/sensors/:sensor_id/service_stations', list_sensor.request);


module.exports = router;
