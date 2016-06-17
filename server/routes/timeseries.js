var express = require('express');
var router = express.Router();

var list = require('../controllers/timeseries/list');
//var delete_all = require('../controllers/timeseries/delete_all');

// LIST
router.get('/sensors/:sensor_id/timeseries', list.request);

// LIST
//router.get('/users/:username/sensors/timeseries', list.request);

// DELETE ALL (only admin)
//router.delete('/sensors/:sensor_id/timeseries', delete_all.request);


module.exports = router;
