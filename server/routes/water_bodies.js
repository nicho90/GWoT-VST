var express = require('express');
var router = express.Router();

var list = require('../controllers/water_bodies/list');
var get = require('../controllers/water_bodies/get');
var post = require('../controllers/water_bodies/post');
var put = require('../controllers/water_bodies/put');
var del = require('../controllers/water_bodies/delete');
var delete_all = require('../controllers/water_bodies/delete_all');


// LIST
router.get('/water_bodies', list.request);

// POST
router.post('/water_bodies', post.request);

// GET
router.get('/water_bodies/:water_body_id', get.request);

// PUT
router.put('/water_bodies/:water_body_id', put.request);

// DELETE
router.delete('/water_bodies/:water_body_id', del.request);

// DELETE ALL
router.delete('/water_bodies', delete_all.request);


module.exports = router;
