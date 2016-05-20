/**
 * Sensor Model for schema validation
 * @type {Object}
 */
module.exports = {
    "properties": {
        "device_id": {
            "type": "string",
            "minLength": 1
        },
        "description": {
            "type": "string",
            "minLength": 0
        },
        "private": {
            "type": "boolean"
        },
        "sensor_height": {
            "type": "number",
            "minimum": 0
        },
        "default_frequency": {
            "type": "number",
            "minimum": 1000
        },
        "threshold_frequency": {
            "type": "number",
            "minimum": 1000
        },
        "threshold_value": {
            "type": "number",
            "minimum": 0
        },
        "lat": {
            "type": "number",
            "minimum": 0
        },
        "lng": {
            "type": "number",
            "minimum": 0
        }
    },
    "required": [
        "device_id",
        "description",
        "private",
        "sensor_height",
        "default_frequency",
        "threshold_frequency",
        "threshold_value",
        "lat",
        "lng"
    ]
};
