var express = require('express');
var router = express.Router();

var list_public = require('../controllers/sensors/list_public');
var list_private = require('../controllers/sensors/list_private');
var post = require('../controllers/sensors/post');
var get_public = require('../controllers/sensors/get_public');
var get_private = require('../controllers/sensors/get_private');
//var put = require('../controllers/sensors/put');
//var del = require('../controllers/sensors/delete');


// LIST (only public sensors)
router.get('/sensors', list_public.request);

// LIST (private sensors & optional public sensors)
router.get('/users/:username/sensors', list_private.request);

// POST
router.post('/users/:username/sensors', post.request);

// GET (public sensors)
router.get('/sensors/:sensor_id', get_public.request);

// GET (only private sensors)
router.get('/users/:username/sensors/:sensor_id', get_private.request);

// PUT
//router.post('/users/:username/sensors/:sensor_id', put.request);

// DELETE
//router.post('/users/:username/sensors/:sensor_id', del.request);



module.exports = router;
