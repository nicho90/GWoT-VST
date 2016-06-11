var express = require('express');
var router = express.Router();

var list = require('../controllers/sensors/list');
//var post = require('../controllers/sensors/post');
//var get = require('../controllers/sensors/get');
//var put = require('../controllers/sensors/put');
//var del = require('../controllers/sensors/delete');
//var delete_all = require('../controllers/sensors/delete_all');


var list_user = require('../controllers/sensors/list_user');
var post_user = require('../controllers/sensors/post_user');
//var get_user = require('../controllers/sensors/get_user');
//var put_user = require('../controllers/sensors/put_user');
//var delete_user = require('../controllers/sensors/delete_user');
//var delete_all_user = require('../controllers/sensors/delete_all_user');


// LIST
router.get('/sensors', list.request);

// POST (only admin)
//router.post('/sensors', post.request);

// DELETE ALL (only admin)
//router.delete('/sensors', delete_all.request);

// GET (only admin)
// router.get('/sensors/:sensor_id', get.request);

// PUT (only admin)
// router.get('/sensors/:sensor_id', put.request);

// DELETE (only admin)
// router.get('/sensors/:sensor_id', del.request);


// LIST (only created sensors of the user)
router.get('/users/:username/sensors', list_user.request);

// DELETE ALL (only created sensors of the user)
// router.delete('/users/:username/sensors', delete_all_user.request);

// POST
router.post('/users/:username/sensors', post_user.request);

// GET
// router.get('/users/:username/sensors/:sensor_id', get_user.request);

// PUT
// router.put('/users/:username/sensors/:sensor_id', put_user.request);

// DELETE
// router.delete('/users/:username/sensors/:sensor_id', delete_user.request);



module.exports = router;
