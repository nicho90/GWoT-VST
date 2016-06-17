/**
 * Login Model for schema validation
 * @type {Object}
 */
module.exports = {
    "properties": {
        "username": {
            "type": "string",
            "minLength": 2
        },
        "password": {
            "type": "string",
            "minLength": 6
        }
    },
    "required": [
        "username",
        "password"
    ]
};
