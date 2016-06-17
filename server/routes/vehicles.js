var express = require('express');
var router = express.Router();

var list = require('../controllers/vehicles/list');
var get = require('../controllers/vehicles/get');
var post = require('../controllers/vehicles/post');
var put = require('../controllers/vehicles/put');
var del = require('../controllers/vehicles/delete');
var delete_all = require('../controllers/vehicles/delete_all');


// LIST
router.get('/vehicles', list.request);

// POST
router.post('/vehicles', post.request);

// GET
router.get('/vehicles/:vehicle_id', get.request);

// PUT
router.put('/vehicles/:vehicle_id', put.request);

// DELETE
router.delete('/vehicles/:vehicle_id', del.request);

// DELETE ALL
router.delete('/vehicles', delete_all.request);


module.exports = router;
