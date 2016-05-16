var express = require('express');
var router = express.Router();

var list = require('../controllers/thresholds/list');
var post = require('../controllers/thresholds/post');
var get = require('../controllers/thresholds/get');
var put = require('../controllers/thresholds/put');
var del = require('../controllers/thresholds/delete');
var del_all = require('../controllers/thresholds/delete_all');


// LIST
router.get('/users/:username/thresholds', list.request);

// POST
router.post('/users/:username/thresholds', post.request);

// GET
router.get('/users/:username/thresholds/:threshold_id', get.request);

// PUT
router.put('/users/:username/thresholds/:threshold_id', put.request);

// DELETE
router.delete('/users/:username/thresholds/:threshold_id', del.request);

// DELETE ALL
router.delete('/users/:username/thresholds', del_all.request);



module.exports = router;
