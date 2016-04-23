/**
 * Set Database Option for Pub/Sub Collection (Redis or MongoDB)
 * Create MQTT-Broker, if no Broker was needed, start only the simple webserver
 */
var mosca = require('mosca');
var pubSubOption = require('../server.js').pubSubOption;
var simpleServer = false;
var broker;


// Set Mosca-Broker settings
var moscaSettings = {
    port: 1883
};

// Set more specific Mosca-Broker settings
if (pubSubOption === "redis") {

    // Use Redis
    var ascoltatore = {
        type: 'redis',
        redis: require('redis'),
        db: 12,
        port: 6379,
        return_buffers: true, // to handle binary payloads
        host: "localhost"
    };
    moscaSettings.backend = ascoltatore;
    moscaSettings.persistence = { factory: mosca.persistence.Redis };

} else if (pubSubOption === "mongodb") {

    // Use MongoDB
    var ascoltatore = {
        type: 'mongo',
        url: 'mongodb://127.0.0.1:27017/mqtt',
        pubsubCollection: 'ascoltatori',
        mongo: {}
    };
    moscaSettings.backend = ascoltatore;
    moscaSettings.persistence = {
        factory: mosca.persistence.Mongo,
        url: 'mongodb://127.0.0.1:27017/mqtt'
    };

} else {
    simpleServer = true;
}


/**
 * Create Mosca-Broker
 */
if (!simpleServer) {
    broker = new mosca.Server(moscaSettings);
} else {
    console.log("Simple Webserver, no MQTT-Broker");
}

exports.broker = broker;
exports.moscaSettings = moscaSettings;
