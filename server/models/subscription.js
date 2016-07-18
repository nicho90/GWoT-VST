/**
 * Subscription Model for schema validation
 * @type {Object}
 */
module.exports = {
    "properties": {
        "creator": {
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
        "creator",
        "sensor_id",
        "threshold_id"
    ]
};
