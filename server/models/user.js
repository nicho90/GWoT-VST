/**
 * User Model for schema validation
 * @type {Object}
 */
module.exports = {
    "properties": {
        "first_name": {
            "type": "string",
            "minLength": 1
        },
        "last_name": {
            "type": "string",
            "minLength": 1
        },
        "email_address": {
            "type": "string",
            "format": "email"
        },
        "password": {
            "type": "string",
            "minLength": 6
        },
        "username": {
            "type": "string",
            "minLength": 2
        },
        "language": {
            "type": "string"
        }
    },
    "required": [
        "first_name",
        "last_name",
        "email_address",
        "password",
        "username",
        "language"
    ]
};
