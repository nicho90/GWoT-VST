/**
 * Vehicle Model for schema validation
 * @type {Object}
 */
module.exports = {
    "properties": {
        "description": {
            "type": "string",
            "minLength": 1
        }
    },
    "required": [
        "description"
    ]
};
