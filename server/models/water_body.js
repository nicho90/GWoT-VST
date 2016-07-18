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
        "water_body_type": {
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
        "water_body_type"
    ]
};
