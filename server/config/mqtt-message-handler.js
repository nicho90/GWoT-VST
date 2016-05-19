var broker = require('./mqtt-broker.js').broker;
var moscaSettings = require('./mqtt-broker.js').moscaSettings;
var postprocessScheduled = require('./postprocess-scheduled.js');
var postprocessRealtime = require('./postprocess-realtime.js');

if (broker !== undefined) {

    // Start
    broker.on('ready', function() {
        console.log('Mosca-Broker is listening at port ' + moscaSettings.port);
    });

    // Client Connect
    broker.on('clientConnected', function(client) {
        console.log('Client connected', client.id);
        // TODO: Insert sensor-status in Database and send Websocket-Message
    });

    // Client Disconnect
    broker.on('clientDisconnected', function(client) {
        console.log('Client disconnected', client.id);
        // TODO: Insert sensor-status in Database and send Websocket-Message
    });


    /**
     * Message-Handler
     */
    broker.on('published', function(packet, client) {
        //console.log('Published', client);

        // MQTT-topics
        if (packet.topic == "heartbeat") {
            console.log('Message heartbeat ', packet.payload.toString());
        } else if (packet.topic == "/data/realtime") {
            console.log('Message realtime', packet.payload.toString());
        } else if (packet.topic == "/settings") {
            console.log('Message settings', packet.payload.toString());
        } else if (packet.topic == "/ipcheck") {
            console.log('Message ipcheck', packet.payload.toString());
        } else if (packet.topic == "/sensor/ip") {
            console.log('Message sensor ip', packet.payload.toString());
        } else if (packet.topic == "/sensor/scheduled/measurement") {
            //console.log('Message scheduled measurement ', packet.payload.toString());
            var measurements = JSON.parse(packet.payload).features;
            var medianMeasurement = median(measurements);
            console.log("Half: ", medianMeasurement);
            // TODO push medianMeasurement to DB
            postprocessScheduled.process;
        } else if (packet.topic == "/sensor/realtime/measurement") {
            console.log('Message realtime measurement', packet.payload.toString());
            // Here are the realtime measurment messages incomming
            // TODO handle incomming data
        }

    });
};

var median = function(values) {
    values.sort(function(a, b) {
        return a.properties.distance.value - b.properties.distance.value;
    });
    var half = Math.floor(values.length / 2);
    return values[half];
};

module.exports = broker;
