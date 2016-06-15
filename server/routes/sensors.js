var express = require('express');
var router = express.Router();

var list = require('../controllers/sensors/list');
var post = require('../controllers/sensors/post');
var get = require('../controllers/sensors/get');
var put = require('../controllers/sensors/put');
var del = require('../controllers/sensors/delete');
var delete_all = require('../controllers/sensors/delete_all');

var user_list = require('../controllers/sensors/user_list');
var user_post = require('../controllers/sensors/user_post');
var user_get = require('../controllers/sensors/user_get');
var user_put = require('../controllers/sensors/user_put');
var user_delete = require('../controllers/sensors/user_delete');
var user_delete_all = require('../controllers/sensors/user_delete_all');


// LIST
router.get('/sensors', list.request);

// POST (only admin)
router.post('/sensors', post.request);

// DELETE ALL (only admin)
router.delete('/sensors', delete_all.request);

// GET
router.get('/sensors/:sensor_id', get.request);

// PUT (only admin)
router.get('/sensors/:sensor_id', put.request);

// DELETE (only admin)
router.get('/sensors/:sensor_id', del.request);


// LIST (only created sensors of the user)
router.get('/users/:username/sensors', user_list.request);

// DELETE ALL (only created sensors of the user)
router.delete('/users/:username/sensors', user_delete_all.request);

// POST
router.post('/users/:username/sensors', user_post.request);

// GET
router.get('/users/:username/sensors/:sensor_id', user_get.request);

// PUT
router.put('/users/:username/sensors/:sensor_id', user_put.request);

// DELETE
router.delete('/users/:username/sensors/:sensor_id', user_delete.request);



module.exports = router;
