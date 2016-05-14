var express = require('express');
var router = express.Router();

var list = require('../controllers/vehicles');


// LIST
router.get('/vehicles', list.request);


module.exports = router;
