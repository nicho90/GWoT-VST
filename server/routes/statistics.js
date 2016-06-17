var express = require('express');
var router = express.Router();

var get = require('../controllers/statistics/get');


// GET
router.get('/sensors/:sensor_id/statistics', get.request);


module.exports = router;
