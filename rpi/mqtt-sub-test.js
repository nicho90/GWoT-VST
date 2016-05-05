var mqtt    = require('mqtt');
/*var client  = mqtt.connect('mqtt://128.176.146.128:1883');*/
var client  = mqtt.connect('mqtt://giv-gwot-vst.uni-muenster.de:1883');

client.on('connect', function () {
  client.subscribe('/sensor/scheduled/measurement');

client.on('message', function (topic, message) {
  console.log(message.toString());
  });
});
