// Require packages
var usonic = require("r-pi-usonic");
var gpios = require("gpio");
var mqtt = require("mqtt");


/**
 * Pysical connection to the sensor
 */
var gpio = {
  trig : 23,  // TRIG pin of the sensor; fix
  echo : 24,  // ECHO pin of the sensor; fix
  measurementTimeout : 750,  // timeout for the r-pi-usonic package; fix
  sensor : null  // measuring function
}

/**
 * Phyiscal connection of a LED
 */
var led = gpios.export(17, {
   direction: "out",
   ready: function() {
   }
});

/**
 * Sensor Data
 */
var sensor = {
  id : "rpi-1",
  lng : 7.698035, // e.g. from GPS-Sensor or Settings
  lat : 51.9733937, // e.g. from GPS-Sensor or Settings
  interval : 3000, // ms => 1 min = 60000 ms
  distance : 100 // reference hight of the sensor
}


/**
 * Measurement object for storing every measurment and generating the message
 */
var measurement = {
  id : sensor.id,
  timestamp : new Date(),
  distance : 0,  // Distance in cm
  lng : sensor.lng, // (regarding geoMQTT)
  lat : sensor.lat // (regarding geoMQTT)
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
      gpio.sensor = usonic.createSensor(gpio.echo, gpio.trig, gpio.measurementTimeout);
      timer.start();
    }
  });
};


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
    measurement.distance = gpio.sensor();
    measurement.timestamp = new Date();
    this.publish();
    this.blink();
    this.start();
  },
  publish : function() {
    // Publish here the measurement via MQTT
    console.log("Distance " + measurement.distance + " measured at time " + measurement.timestamp);
  },
  blink : function() {
    led.set()
    setTimeout(function() {
      led.set(0);
    }, 200);
  },
  stop : function() {
    console.log("Stop");
    this.stopped = true;
    clearTimeout(this.timeout);
    return;
  }
};


/**
 * Function to set a new timer interval
 */
var setTimerInterval = function(iv) {
  timer.stop();
  timer.start(iv);
};


initSensor();

