var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://giv-gwot-vst.uni-muenster.de:1883');

client.on('connect', function() {
    //client.publish('/data/realtime', '{"device_id": "rpi-1","status" : true}', {retain: false, qa: 1});
    //client.publish('/data/realtime', '{"device_id": "rpi-1","status" : false}', {retain: false, qa: 1});
    //client.publish('/settings', '{"device_id": "rpi-1","interval": 5000}', {retain: false, qa: 1});

    // Manipulate for testing
    var data = '{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[0,0]},"properties":{"device_id":"rpi-3","timestamp":"2016-07-05T14:18:20.932Z","distance":{"value":111.68524137931036,"unit":"cm"}}},{"type":"Feature","geometry":{"type":"Point","coordinates":[0,0]},"properties":{"device_id":"rpi-3","timestamp":"2016-07-05T14:18:43.407Z","distance":{"value":111.85222413793105,"unit":"cm"}}},{"type":"Feature","geometry":{"type":"Point","coordinates":[0,0]},"properties":{"device_id":"rpi-3","timestamp":"2016-07-05T14:18:55.428Z","distance":{"value":111.5826206896552,"unit":"cm"}}},{"type":"Feature","geometry":{"type":"Point","coordinates":[0,0]},"properties":{"device_id":"rpi-3","timestamp":"2016-07-05T14:19:07.460Z","distance":{"111":442.5963448275862,"unit":"cm"}}},{"type":"Feature","geometry":{"type":"Point","coordinates":[0,0]},"properties":{"device_id":"rpi-3","timestamp":"2016-07-05T14:19:19.495Z","distance":{"111":441.97855172413796,"unit":"cm"}}}]}';

    client.publish('/sensor/scheduled/measurement', data, {retain: false, qa: 1});

    client.end();
});
