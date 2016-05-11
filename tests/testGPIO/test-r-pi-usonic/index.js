var usonic = require("r-pi-usonic");

TRIG = 21;
ECHO = 20;
MEASUREMENT_TIMEOUT = 750;
MEASUREMENT_INTERVAL = 2000;

usonic.init(function (error) {
    if (error) {
       	console.log("Init error.");
    } else {
	console.log("No error.");
	var sensor = usonic.createSensor(ECHO, TRIG, MEASUREMENT_TIMEOUT);
	
	setInterval(function() {
		var distance = sensor();
		console.log(distance);
	},MEASUREMENT_INTERVAL);
    }
});

setTimeout(function(){
	MEASUREMENT_INTERVAL = 500;
	console.log("Measurment Interval adjusted");
},10000);
