var broker = require('./mqtt-broker.js').broker;

// Start
broker.on('ready', function(){
    console.log('Mosca server is up and running');
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
var message = {
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
}, 3000);


/**
 * Message-Handler
 */
broker.on('published', function(packet, client) {
    //console.log('Published', client);
    // TODO: Design Publish/Subscribe messages for Broker and Raspberry Pi


    // CURRENT FOR TESTING
    if (packet.topic == "heartbeat") {
        console.log('Message', packet.payload.toString());
    } else if (packet.topic == "distance") {
        console.log('Message', packet.payload.toString());
    } else if (packet.topic == "/rpi/test") {
        console.log('RPI-Message', packet.payload.toString());
    } else if (packet.topic == "cloud") {
        console.log('CLOUD-Message', packet.payload.toString());
    }

});


module.exports = broker;
