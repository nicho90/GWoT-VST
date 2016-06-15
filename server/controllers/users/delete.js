var pg = require('pg');
var _ = require('underscore');
var jwt = require('jsonwebtoken');
var secret = require('./../../config/secret');
var db_settings = require('../../server.js').db_settings;
var errors = require('./../../config/errors');
var verifier = require('./../../config/verifier');


// DELETE
exports.request = function(req, res){
    res.status(errors.development.error_1.code).send(errors.development.error_1);
    
    // TODO
};
