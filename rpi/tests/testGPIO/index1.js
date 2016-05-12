var gpio = require("gpio");

pin = 17;

var gpio17 = gpio.export(pin, {
	direction: "out",
	ready: function(){
		gpio17.set();
		console.log("set");
		setTimeout(function(){
			gpio17.set(0);
			console.log("set0");
		}, 1000);
		setTimeout(function(){
			//gpio17.reset();
			console.log("unexport");
			gpio17.unexport();
		},3000);
	}
});
