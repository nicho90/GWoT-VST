var express = require('express');
var router = express.Router();

var list = require('../controllers/measurements/list');
//var delete_all = require('../controllers/measurements/delete_all');


// LIST
router.get('/sensors/:sensor_id/measurements', list.request);

// DELETE ALL (only admin)
//router.delete('/sensors/:sensor_id/measurements', delete_all.request);


module.exports = router;
