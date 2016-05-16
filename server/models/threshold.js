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
        "value": {
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
                "TRUCK",
                "OTHER"
            ]
        }
    },
    "required": [
        "username",
        "description",
        "value",
        "category"
    ]
};
