var express = require('express');
var router = express.Router();

var list = require('../controllers/water_bodies/list');
var get = require('../controllers/water_bodies/get');


// LIST
router.get('/water_bodies', list.request);

// GET
router.get('/water_bodies/:water_body_id', get.request);

module.exports = router;
