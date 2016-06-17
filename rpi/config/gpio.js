/**
 * Sensor GPIO-Settings
 */
module.exports = {
    led: 17, // Pin for the LED
    trig: 23, // TRIG pin of the sensor; fix
    echo: 24, // ECHO pin of the sensor; fix
    measurement_timeout: 750, // timeout for the r-pi-usonic package; fix
    sensor: null // measuring function
};
