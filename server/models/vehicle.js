/**
 * Vehicle Model for schema validation
 * @type {Object}
 */
module.exports = {
    "properties": {
        "brand": {
            "type": "string",
            "minLength": 1
        },
        "name": {
            "type": "string",
            "minLength": 1
        },
        "year": {
            "type": "integer",
            "minimum": 0
        },
        "warning_height": {
            "type": "number",
            "minimum": 0
        },
        "critical_height": {
            "type": "number",
            "minimum": 0
        },
        "category": {
            "type": "string",
            "enum": [
                "BIKE",
                "WHEELCHAIR",
                "SCOOTER",
                "MOTORBIKE",
                "CAR",
                "BUS",
                "TRUCK"
            ]
        }
    },
    "required": [
        "brand",
        "name",
        "year",
        "warning_height",
        "critical_height",
        "category"
    ]
};
