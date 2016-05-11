//var ifaces = require('os').networkInterfaces();
//console.log(ifaces.wlan0);

var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://giv-gwot-vst.uni-muenster.de:1883');

client.on('connect', function() {
    //client.publish('/data/realtime', '{"device_id": "rpi-1","status" : true}', {retain: false, qa: 1});
    //client.publish('/data/realtime', '{"device_id": "rpi-1","status" : false}', {retain: false, qa: 1});
    client.publish('/ipcheck', '', {
        retain: false,
        qa: 1
    });

    client.subscribe('/sensor/ip');

    client.on('message', function(topic, message) {
        console.log(message.toString());
    });

    client.end();
});
