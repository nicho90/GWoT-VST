var express = require('express');
var router = express.Router();

var get = require('../controllers/forecast/get');


// GET
router.get('/forecast', get.request);


module.exports = router;
