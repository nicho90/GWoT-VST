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
        "water_body_id": {
            "type": "integer",
            "minimum": 0
        },
        "sensor_height": {
            "type": "number",
            "minimum": 0
        },
        "crossing_height": {
            "type": "number",
            "minimum": 0
        },
        "threshold_value": {
            "type": "number",
            "minimum": 0
        },
        "default_frequency": {
            "type": "integer",
            "minimum": 1000
        },
        "danger_frequency": {
            "type": "integer",
            "minimum": 1000
        },
        "lng": {
            "type": "number",
            "minimum": 0
        },
        "lat": {
            "type": "number",
            "minimum": 0
        }
    },
    "required": [
        "device_id",
        "description",
        "private",
        "water_body_id",
        "sensor_height",
        "crossing_height",
        "threshold_value",
        "default_frequency",
        "danger_frequency",
        "lng",
        "lat"
    ]
};
