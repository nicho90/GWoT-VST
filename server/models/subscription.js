/**
 * Subscription Model for schema validation
 * @type {Object}
 */
module.exports = {
    "properties": {
        "username": {
            "type": "string",
            "minLength": 2
        },
        "sensor_id": {
            "type": "integer"
        },
        "threshold_id": {
            "type": "integer"
        }
    },
    "required": [
        "username",
        "sensor_id",
        "threshold_id"
    ]
};
