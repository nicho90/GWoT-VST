var mqtt    = require('mqtt');
var client  = mqtt.connect('mqtt://giv-gwot-vst.uni-muenster.de:1883');
 
client.on('connect', function () {
  client.publish('presence', 'Hello!', {retain: false, qa: 1});
client.end();
});
