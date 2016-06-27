var errors = require('./../../config/errors');


// GET
exports.request = function(req, res) {
    res.status(errors.development.error_1.code).send(errors.development.error_1);
};
