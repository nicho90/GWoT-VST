var gpio = require("gpio");

var gpio17, invervalTimer;
var pin = 17;

// Flashing lights if LED connected to GPIO17
gpio17 = gpio.export(pin, {
    direction:'out',
    ready: function() {
      intervalTimer = setInterval(function() {
         gpio17.set();
	 console.log(gpio17.value);
         setTimeout(function() { 
		gpio17.set(0);
		console.log(gpio17.value);
	 }, 500); //Blinking time LED off after x millis
      }, 1000); //Blinking time LED on every x millis
   }
});
