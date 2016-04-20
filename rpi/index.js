var usonic = require("r-pi-usonic");

TRIG = 23;
ECHO = 24;
MEASUREMENT_TIMEOUT = 750;
MEASUREMENT_INTERVAL = 60000;
SENSOR = null;
DISTANCE = 0;

// Ultasonic Sensor initialization. Needs to be called once when script starts
usonic.init(function (error) {
    if (error) {
        console.log("Sensor initialization failed.");
    } else {                                                                                  
        console.log("Sensor initialization succeeded. " + new Date());
        SENSOR = usonic.createSensor(ECHO, TRIG, MEASUREMENT_TIMEOUT);                    
    }
});

var timer = {
        stopped : false,
        interval : MEASUREMENT_INTERVAL,	// default measurement interval
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
                DISTANCE = SENSOR();
		this.publish();
                this.start();
        },
        publish : function() {
                // Publish here the measurement via MQTT
                console.log("Distance " + DISTANCE + " measured at time " + new Date());
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
