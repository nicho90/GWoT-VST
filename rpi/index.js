var usonic = require("r-pi-usonic");

TRIG = 23;
ECHO = 24;
MEASUREMENT_TIMEOUT = 750;
MEASUREMENT_INTERVAL = 5000;
SENSOR = null;
DISTANCE = 0;

// Ultasonic Sensor initialization. Needs to be called once when script starts
usonic.init(function (error) {
    if (error) {
        console.log("Sensor initialization failed.");
    } else {
        console.log("Sensor initialization succeeded.");
        SENSOR = usonic.createSensor(ECHO, TRIG, MEASUREMENT_TIMEOUT);
    }
});

var timer = {
        stopped : false,
        interval : MEASUREMENT_INTERVAL,	// default measurement interval
        start : function(iv) {
                this.stopped = false;
                console.log("Start");
                if(iv) this.interval = iv;
                this.timeout = setTimeout(function() {
                        timer.measure();
                }, this.interval);
        },
        measure : function() {
                if (this.stopped) return;
                // Make here the measurement
                console.log("Measure");
                DISTANCE = SENSOR();
		this.publish();
                this.start();
        },
        publish : function() {
                // Publish here the measurement via MQTT
                console.log("Publish distance " + DISTANCE);
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

timer.start();





/*********************************************************************
    Notes from Nicho: This code can be merged into the code above
    to connect the MQTT-Client to the real sensor
*********************************************************************/

// Required Packages
var mqtt = require('mqtt');

/**
 * Config for local sensor
 * @type {{sensor_id: string, lng: number, lat: number, interval: number, measurement: number}}
 */
var sensor = {
    sensor_id: "rpi-1",
    lng: 7.698035, // e.g. from GPS-Sensor or Settings
    lat: 51.9733937, // e.g. from GPS-Sensor or Settings
    interval: 10000, // ms => 30 min (1 sek = 1000 ms; 1 min = 60000 ms)
    distance: 100 // cm (to the ground of the river)
};


// TEST: Measurement-Message
// TODO: Connect to real sensor and send with real measurements
var measurement = {
    sensor_id: sensor.sensor_id,
    timestamp: Date.now(),
    measurement: 70, // cm
    lng: sensor.lng, // (regarding geoMQTT)
    lat: sensor.lat // (regarding geoMQTT)
};


/**
 * Create MQTT-Client and setup clientId, if MQTT-Broker is online (heartbeat)
 */
var client = mqtt.connect('mqtt://127.0.0.1:1883', {
    encoding: 'utf8',
    clientId: 'rpi',
    will: { // Last Will (if Sensor goes offline)
        topic: 'dead',
        payload: 'mypayload',
        qos: 2,
        retain: true
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

    // TODO: Implementation of real sensor and measurements


    // TEST: Send a message every 3 Seconds to Broker
    var i = 0;
    setInterval(function() {
        var topic = '/rpi/test';
        var message = measurement.toString();
        var options = {
            qos: 2, // Quality of Service: 2 = at least once
            retain: false
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





// OLD MESSAGE-HANDLER (currently not used)
// But could be helpful for heartbeat-message (= if the RPi connects to the MQTT-Broker)

/*var handleConnect = function() {

    //console.log('Connected to mqtt broker with ClientId:', client.options.clientId);
    client.on('message', handleMessage);

    client.subscribe('heartbeat');
    client.publish('heartbeat', sensor.id);

    client.publish('distance', data.toString());

};

var handleMessage = function(topic, message, packet) {
    console.log('Received Message');
    console.log('topic: ' + topic + '; message: ' + message);
};

client.on('connect', handleConnect);*/
