// Require packages
var usonic = require("r-pi-usonic");
var gpio = require("gpio");
var mqtt = require("mqtt");
var GeoJSON = require('geojson');
var sensor = require("./config/sensor");

/**
 * Pysical connection to the sensor
 */
var gpioPins = {
  led : 17,   // Pin for the LED
  trig : 23,  // TRIG pin of the sensor; fix
  echo : 24,  // ECHO pin of the sensor; fix
  measurementTimeout : 750,  // timeout for the r-pi-usonic package; fix
  sensor : null  // measuring function
};

/**
 * Phyiscal connection of a LED
 */
var led = gpio.export(gpioPins.led, {
  direction: "out",
  ready: function() {}
});


/**
 * Scheduled measurment
 */
var scheduled = {
  status : true,
  interval : sensor.interval, // default interval 1 min
  start : function () {
    if (!this.status) return;
    this.timeout = setTimeout(function() {
      scheduled.publish();
    }, this.interval);
  },
  publish : function() {
    pubSD();
    this.start();
  },
  stop : function() {
    clearTimeout(this.timeout);
    return;
  }
};


/**
 * Function to reset the scheduled timer interval
 */
var resetScheduledTimer = function() {
  scheduled.stop();
  scheduled.start();
};


/**
 * Realtime measurment
 */
var realtime = {
  status : false,
  interval : 1000,
  start : function () {
    if (!this.status) return;
    this.timeout = setTimeout(function() {
      realtime.publish();
    }, this.interval);
  },
  publish : function() {
    pubRT();
    this.start();
  },
  stop : function() {
    clearTimeout(this.timeout);
    return;
  }
};


/**
 * Function to reset the realtime timer interval
 */
var resetRealtimeTimer = function() {
  realtime.stop();
  realtime.start();
};


/**
 * Measurement object for storing every measurment and generating the message
 */
var measurement = {
  device_id : sensor.device_id,
  timestamp : new Date(),
  distance : 0,  // Distance in cm
  lng : sensor.lng, // (regarding geoMQTT)
  lat : sensor.lat // (regarding geoMQTT)
};


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
      scheduled.start();
      realtime.start();
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
    if(iv) this.interval = iv;
    this.timeout = setTimeout(function() {
      timer.measure();
    }, this.interval);
  },
  measure : function() {
    if (this.stopped) return;
    // Make the measurement
    measurement.distance = gpioPins.sensor();
    measurement.timestamp = new Date();
    console.log("Distance " + measurement.distance + " measured at time " + measurement.timestamp);
    this.blink();
    this.start();
  },
  blink : function() {
    led.set()
    setTimeout(function() {
      led.set(0);
    }, 100);
  },
  stop : function() {
    this.stopped = true;
    clearTimeout(this.timeout);
    return;
  }
};


/**
 * Function to set a new timer interval
 */
var setMeasurementTimer = function(iv) {
  timer.stop();
  timer.start(iv);
};

/**
 * Initialize and start the sensor
 */
initSensor();

/**
 * Create MQTT-Client and setup clientId, if MQTT-Broker is online (heartbeat)
 */
var client = mqtt.connect('mqtt://giv-gwot-vst.uni-muenster.de:1883', {
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
 * Connect to MQTT-Broker
 */
client.on('connect', function () {
  options = {
    qos : 2, // Quality of Service: 2 = at least once
    retain : false
  };
});


/**
 * Publish message with scheduled data
 */
var pubSD = function() {
  client.publish(
    '/sensor/scheduled/measurement',
    JSON.stringify(GeoJSON.parse([measurement], {Point: ['lat', 'lng']})),
    this.options);
};


/**
 * Publish message with realtime data
 */
var pubRT = function() {
  client.publish(
    '/sensor/realtime/measurement',
    JSON.stringify(GeoJSON.parse([measurement], {Point: ['lat', 'lng']})),
    this.options
  );
};


/**
 * Subscribe to topic from MQTT-Broker
 */
client.subscribe('/data/realtime');
client.subscribe('/settings');


/**
 * Recieve Messages from MQTT-Broker
 */
client.on('message', function (topic, message) {
  switch(topic) {
    case '/data/realtime':
      var message = JSON.parse(message);
      realtime.status = message.status;
	    if (message.status) {
	      timer.interval = realtime.interval;
        setMeasurementTimer(realtime.interval);
	      resetRealtimeTimer();
      } else if (!message.status) {
        timer.interval = scheduled.interval;
        setMeasurementTimer(scheduled.interval);
	      resetRealtimeTimer();
        resetScheduledTimer();
      }
      break;
    case '/settings':
	    var message = JSON.parse(message);
      scheduled.interval = message.interval;
      if (!realtime.status){
        setMeasurementTimer(scheduled.interval);
        resetScheduledTimer();
      }
      break;
    default:
        console.log('Default: ' + topic + ": " + message.toString());
  }
});
