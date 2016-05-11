var gpio = require("gpio");

TRIG = 23
ECHO = 24

triggerSignal = function() {
	gpioTrig = gpio.export(TRIG, {
		direction: "out",
		ready: function() {
			gpioTrig.reset();
			console.log("Send signal");
			setTimeout(function() {
				gpioTrig.set();
				console.log("Stop signal");
				triggerEcho();
			},0.01);
		}
	});
}

triggerEcho = function() {
	gpioEcho = gpio.export(ECHO, {
		direction: "in",
		ready: function() {
			console.log("Echo");
			gpioEcho.on("change", function(val) {
				console.log(val);
			});
		}
	});
}

triggerSignal();
