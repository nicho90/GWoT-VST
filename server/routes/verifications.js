var express = require('express');
var router = express.Router();

var user = require('../controllers/verifications/user');
var device = require('../controllers/verifications/device');


// Verify unique username
router.get('/verifications/user', user.request);

// Verify unique device_id
router.get('/verifications/device', device.request);



module.exports = router;
