/**
 * Water-Body Model for schema validation
 * @type {Object}
 */
module.exports = {
    "properties": {
        "name": {
            "type": "string",
            "minLength": 1
        },
        "category": {
            "type": "string",
            "enum": [
                "STREAM",
                "RIVER",
                "CHANNEL",
                "LAKE",
                "POND",
                "POOL"
            ]
        }
    },
    "required": [
        "name",
        "category"
    ]
};
