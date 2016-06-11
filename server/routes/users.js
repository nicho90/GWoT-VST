var express = require('express');
var router = express.Router();

var list = require('../controllers/users/list');
var post = require('../controllers/users/post');
var get = require('../controllers/users/get');
var put = require('../controllers/users/put');
var del = require('../controllers/users/delete');
var delete_all = require('../controllers/users/delete_all');


// LIST (only admin)
router.get('/users', list.request);

// POST
router.post('/users', post.request);

// DELETE ALL (only admin)
router.post('/users', delete_all.request);

// GET
router.get('/users/:username', get.request);

// PUT
router.put('/users/:username', put.request);

// DELETE
router.delete('/users/:username', del.request);



module.exports = router;
