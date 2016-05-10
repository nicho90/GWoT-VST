/**
 * Sensor Default-Settings
 */
module.exports = {
  device_id : "rpi-1",
  lng : 0.0, // e.g. from GPS-Sensor or Settings
  lat : 0.0, // e.g. from GPS-Sensor or Settings
  interval : 60000, // scheduled.interval, // ms => 1 min = 60000 ms
  distance : 100, // reference hight of the sensor
};
