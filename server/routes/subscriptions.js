var express = require('express');
var router = express.Router();

var list = require('../controllers/subscriptions/list');
var post = require('../controllers/subscriptions/post');
var get = require('../controllers/subscriptions/get');
var put = require('../controllers/subscriptions/put');
var del = require('../controllers/subscriptions/delete');
var del_all = require('../controllers/subscriptions/delete_all');


// LIST
router.get('/users/:username/subscriptions', list.request);

// POST
router.post('/users/:username/subscriptions', post.request);

// GET
router.get('/users/:username/subscriptions/:subscription_id', get.request);

// PUT
router.put('/users/:username/subscriptions/:subscription_id', put.request);

// DELETE
router.delete('/users/:username/subscriptions/:subscription_id', del.request);

// DELETE ALL
router.delete('/users/:username/subscriptions', del_all.request);



module.exports = router;
