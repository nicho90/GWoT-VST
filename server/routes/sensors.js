var express = require('express');
var router = express.Router();

var list_public = require('../controllers/sensors/list_public');
var list_private = require('../controllers/sensors/list_private');
var post = require('../controllers/sensors/post');
var get_public = require('../controllers/sensors/get_public');
var get_private = require('../controllers/sensors/get_private');
//var put_public = require('../controllers/sensors/put_public');
var put_private = require('../controllers/sensors/put_private');
//var delete_public = require('../controllers/sensors/delete_public');
var delete_private = require('../controllers/sensors/delete_private');


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

// PUT (only admin)
//router.put('/sensors/:sensor_id', put_public.request);

// PUT (only private sensors)
router.put('/users/:username/sensors/:sensor_id', put_private.request);

// DELETE (only admin)
//router.delete('/sensors/:sensor_id', delete_public.request);

// DELETE (only private sensors)
router.delete('/users/:username/sensors/:sensor_id', delete_private.request);



module.exports = router;
