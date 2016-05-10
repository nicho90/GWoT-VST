var mqtt    = require('mqtt');
var client  = mqtt.connect('mqtt://giv-gwot-vst.uni-muenster.de:1883');

client.on('connect', function () {
  //client.publish('/data/realtime', '{"device_id": "rpi-1","status" : true}', {retain: false, qa: 1});
  //client.publish('/data/realtime', '{"device_id": "rpi-1","status" : false}', {retain: false, qa: 1});
  client.publish('/settings', '{"device_id": "rpi-1","interval": 60000}', {retain: false, qa: 1});

  client.end();
});
