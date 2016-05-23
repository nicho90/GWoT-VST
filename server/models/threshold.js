/**
 * Threshold Model for schema validation
 * @type {Object}
 */
module.exports = {
    "properties": {
        "username": {
            "type": "string",
            "minLength": 2
        },
        "description": {
            "type": "string",
            "minLength": 1
        },
        "warning_threshold": {
            "type": "number",
            "minimum": 0
        },
        "critical_threshold": {
            "type": "number",
            "minimum": 0
        },
        "category": {
            "type": "string",
            "enum": [
                "PEDESTRIAN",
                "BIKE",
                "WHEELCHAIR",
                "SCOOTER",
                "MOTORBIKE",
                "CAR",
                "BUS",
                "TRUCK",
                "OTHER"
            ]
        }
    },
    "required": [
        "username",
        "description",
        "warning_threshold",
        "critical_threshold",
        "category"
    ]
};
