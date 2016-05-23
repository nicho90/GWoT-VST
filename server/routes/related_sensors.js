var express = require('express');
var router = express.Router();

var list = require('../controllers/related_sensors/list');


// LIST (all related sensors with the same Water-Body sorted by distance)
router.get('/sensors/:sensor_id/related_sensors', list.request);


module.exports = router;
