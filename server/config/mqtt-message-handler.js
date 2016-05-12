var broker = require('./mqtt-broker.js').broker;
var moscaSettings = require('./mqtt-broker.js').moscaSettings;

if(broker != undefined){
    // Start
    broker.on('ready', function(){
        console.log('Mosca-Broker is listening at port ' + moscaSettings.port);
    });

    // Client Connect
    broker.on('clientConnected', function(client) {
        console.log('Client connected', client.id);
        // TODO: Insert sensor-status is Database and send Websocket-Message
    });

    // Client Disconnect
    broker.on('clientDisconnected', function(client) {
        console.log('Client disconnected', client.id);
        // TODO: Insert sensor-status is Database and send Websocket-Message
    });


    // CURRENT FOR TESTING
    /*var message = {
        topic: 'cloud',
        payload: 'abcde', // String or a Buffer
        qos: 1, // quality of service: 0, 1, or 2
        retain: false // or true
    };
    var i = 0;
    setInterval(function() {
        broker.publish(message, function() {
            //console.log("Sent: Hello from cloud")
        });
        i += 1;
    }, 3000);*/


    /**
     * Message-Handler
     */
    broker.on('published', function(packet, client) {
        //console.log('Published', client);
        // TODO: Design Publish/Subscribe messages for Broker and Raspberry Pi


        // CURRENT FOR TESTING
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
            console.log('Message scheduled measurement ', packet.payload.toString());
            // Here are the scheduled measurement messages incomming
            // TODO handle incomming data
        } else if (packet.topic == "/sensor/realtime/measurement") {
            console.log('Message realtime measurement', packet.payload.toString());
            // Here are the realtime measurment messages incomming
            // TODO handle incomming data
        }

    });
}

module.exports = broker;
