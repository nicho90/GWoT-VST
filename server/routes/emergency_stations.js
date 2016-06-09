var express = require('express');
var router = express.Router();

var list = require('../controllers/emergency_stations/list');
var get = require('../controllers/emergency_stations/get');
var post = require('../controllers/emergency_stations/post');
var put = require('../controllers/emergency_stations/put');
var del = require('../controllers/emergency_stations/delete');
var delete_all = require('../controllers/emergency_stations/delete_all');


// LIST (all or query nearest Emergency Stations by longitude & latitude)
router.get('/emergency_stations', list.request);

// LIST (nearest Emergency Stations of a Sensor)
router.get('/sensors/:sensor_id/emergency_stations', list.request);

// POST
router.post('/emergency_stations', post.request);

// GET
router.get('/emergency_stations/:emergency_station_id', get.request);

// PUT
router.put('/emergency_stations/:emergency_station_id', put.request);

// DELETE
router.delete('/emergency_stations/:emergency_station_id', del.request);

// DELETE ALL
router.delete('/emergency_stations', delete_all.request);


module.exports = router;
