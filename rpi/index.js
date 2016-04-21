// Require packages
var usonic = require("r-pi-usonic");
var mqtt = require("mqtt");

// Global measurement variables
var gpio = {
  trig : 23;
  echo : 24;
  measurementTimeout : 750;
}

var sensor = {
  sensor : null,
  sensor_id: "rpi-1",
  lng: 7.698035, // e.g. from GPS-Sensor or Settings
  lat: 51.9733937, // e.g. from GPS-Sensor or Settings
  interval: 60000, // ms => 1 min = 60000 ms
  distance: 100 // reference hight of the sensor
}

var measurement = {
  sensor_id : sensor.sensor_id,
  timestamp : Date.now(),
  measurement : 0,  // Distance in cm
  lng: sensor.lng, // (regarding geoMQTT)
  lat: sensor.lat // (regarding geoMQTT)
}

/**
 * Ultasonic Sensor initialization. Needs to be called once when script starts
 */
var initSensor = function() {
  usonic.init(function (error) {
    if (error) {
      console.log("Sensor initialization failed.");
    } else {
      console.log("Sensor initialization succeeded. " + new Date());
      sensor.sensor = usonic.createSensor(gpio.echo, gpio.trig, gpio.measurementTimeout);
      timer.start();
    }
  });
}

/**
 *
 */
var timer = {
  stopped : false,
  interval : sensor.interval,	// default measurement interval
  start : function(iv) {
    this.stopped = false;
    //console.log("Start");
    if(iv) this.interval = iv;
    this.timeout = setTimeout(function() {
      timer.measure();
    }, this.interval);
  },
  measure : function() {
    if (this.stopped) return;
    // Make here the measurement
    // console.log("Measure");
    measurement.distance = sensor.sensor();
    measurement.timestamp = Date.now();
    this.publish();
    this.start();
  },
  publish : function() {
    // Publish here the measurement via MQTT
    console.log("Distance " + measurement.distance + " measured at time " + measurement.timestamp);
  },
  stop : function() {
    console.log("Stop");
    this.stopped = true;
    clearTimeout(this.timeout);
    return;
  }
};

var setTimerInterval = function(iv) {
  timer.stop();
  timer.start(iv);
};

initSensor();
