var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://giv-gwot-vst.uni-muenster.de:1883');

client.on('connect', function() {
  options = {
      qa: 1, // Quality of Service: 2 = at least once
      retain: false
  }
});

client.subscribe('/sensor/ip');

client.on('message', function (topic, message) {
  console.log(message.toString());
  client.end();
});

client.publish('/ipcheck', '', this.options);
