/**
 * Emergency-Station Model for schema validation
 * @type {Object}
 */
module.exports = {
    "properties": {
        "name": {
            "type": "string",
            "minLength": 1
        },
        "phone_number": {
            "type": "string",
            "minLength": 1
        },
        "street": {
            "type": "string",
            "minLength": 1
        },
        "house_number": {
            "type": "string"
        },
        "addition": {
            "type": "string"
        },
        "zip_code": {
            "type": "string",
            "minLength": 1
        },
        "city": {
            "type": "string",
            "minLength": 1
        },
        "state": {
            "type": "string",
            "minLength": 1
        },
        "country": {
            "type": "string",
            "minLength": 1
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
        "name",
        "phone_number",
        "street",
        "zip_code",
        "city",
        "state",
        "country",
        "lng",
        "lat"
    ]
};
