var express = require('express');
var router = express.Router();

var list = require('../controllers/vehicles/list');
var get = require('../controllers/vehicles/get');


// LIST
router.get('/vehicles', list.request);

// GET
router.get('/vehicles/:vehicle_id', get.request);


module.exports = router;
