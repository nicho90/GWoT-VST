// Require packages
var usonic = require("r-pi-usonic");
var gpio = require("gpio");
var mqtt = require("mqtt");


/**
 * Pysical connection to the sensor
 */
var gpioPins = {
  led : 17,   // Pin for the LED
  trig : 23,  // TRIG pin of the sensor; fix
  echo : 24,  // ECHO pin of the sensor; fix
  measurementTimeout : 750,  // timeout for the r-pi-usonic package; fix
  sensor : null  // measuring function
}

/**
 * Phyiscal connection of a LED
 */
var led = gpio.export(gpioPins.led, {
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
      gpioPins.sensor = usonic.createSensor(gpioPins.echo, gpioPins.trig, gpioPins.measurementTimeout);
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

/**
 * Create MQTT-Client and setup clientId, if MQTT-Broker is online (heartbeat)
 */
var client = mqtt.connect('mqtt://127.0.0.1:1883', {
    encoding : 'utf8',
    clientId : 'rpi',
    will : { // Last Will (if Sensor goes offline)
        topic : 'dead',
        payload : 'mypayload',
        qos : 2,
        retain : true
    }
});


/**
 * Subscribe to topic from MQTT-Broker
 */
client.subscribe('cloud');
// TODO: Define MQTT-Messages


/**
 * Connect to MQTT-Broker
 */
client.on('connect', function () {
  // TEST: Send a message every 3 Seconds to Broker
  var i = 0;
  setInterval(function() {
    var topic = '/rpi/test';
    //var message = "test";
    var message = measurement.distance.toString();
    //var message = measurement.toString();
    var options = {
      qos : 2, // Quality of Service: 2 = at least once
      retain : false
    };

    // Publish message
    client.publish(topic, message, options, function(){
      console.log("rpi: Hello from rpi")
    });
    i += 1;
  }, 3000);
});


/**
 * Recieve Messages from MQTT-Broker
 */
client.on('message', function (topic, message) {
  console.log(topic + ": " + message.toString());
  //client.end(); // No need to close connection, otherwise program will be closed

  // TODO:
  // - Implement Settings (Topic) from the MQTT-Broker
  // - Implement update-interval, if defined thresholds are closer
  // - Implement update-interval for real-time-data, if a User clicks in the WebClient on a Sensor
});
