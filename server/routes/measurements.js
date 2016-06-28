var express = require('express');
var router = express.Router();

var list = require('../controllers/measurements/list');
var get = require('../controllers/measurements/get');
var post = require('../controllers/measurements/post');
var put = require('../controllers/measurements/put');
var del = require('../controllers/measurements/delete');
var delete_all = require('../controllers/measurements/delete_all');

var get_latest = require('../controllers/measurements/get_latest');


// LIST
router.get('/sensors/:sensor_id/measurements', list.request);

// POST
router.post('/sensors/:sensor_id/measurements', post.request);

// GET
router.get('/sensors/:sensor_id/measurements/:measurement_id', get.request);

// PUT
router.put('/sensors/:sensor_id/measurements/:measurement_id', put.request);

// DELETE
router.delete('/sensors/:sensor_id/measurements/:measurement_id', del.request);

// DELETE ALL
router.delete('/sensors/:sensor_id/measurements', delete_all.request);


// GET LATEST
router.get('/sensors/:sensor_id/latest/measurement', get_latest.request);

module.exports = router;
