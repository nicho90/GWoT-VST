var express = require('express');
var router = express.Router();

var post = require('../controllers/login');


// LOGIN
router.post('/login', post.request);


module.exports = router;
