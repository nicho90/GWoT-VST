var express = require('express');
var router = express.Router();

var list = require('../controllers/timeseries/list');
var post = require('../controllers/timeseries/post');
var get = require('../controllers/timeseries/get');
var put = require('../controllers/timeseries/put');
var del = require('../controllers/timeseries/delete');
var delete_all = require('../controllers/timeseries/delete_all');


// LIST
router.get('/sensors/:sensor_id/timeseries', list.request);

// POST
router.post('/sensors/:sensor_id/timeseries', post.request);

// DELETE ALL
router.delete('/sensors/:sensor_id/timeseries', delete_all.request);

// GET
router.get('/sensors/:sensor_id/timeseries/:timeseries_id', get.request);

// PUT
router.put('/sensors/:sensor_id/timeseries/:timeseries_id', put.request);

// DELETE
router.delete('/sensors/:sensor_id/timeseries/:timeseries_id', del.request);


module.exports = router;
