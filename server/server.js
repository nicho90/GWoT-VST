var program = require('commander');
var path = require('path');


/**
 * Command-Line params
 */
program
    .version('1.0.0')
    .option('-d, --dev', 'Use local development database')
    .option('-m, --mongodb', 'Use MongoDB database')
    .option('-r, --redis', 'Use Redis database')
    //.option('-e, --entries', 'Add Example-Entries')
    //.option('-f, --force', 'Delete all entries')
    .parse(process.argv);

// Check for local or in-production database
var devStatus = false;
if(program.dev){
    devStatus = true;
}
exports.dev = devStatus;

// Check if Redis or MongoDB was selected as pub-sub-database, otherwise run only simple webserver
var pubSubOption;
if(program.redis){
    pubSubOption = "redis";
} else if (program.mongodb){
    pubSubOption = "mongodb";
} else {
    ubSubOption = "";
}
exports.pubSubOption = pubSubOption;



/**
 * Start Express-Webserver
 */
var express = require('express');
var app = express();
var server = require('http').createServer(app);

// Set Server-Port
var port = process.env.PORT || 3000;
server.listen(port, function () {
    console.log('Webserver listening at port %d', port);
});

// Set folder for static files (WebClient)
app.use(express.static(__dirname + '/public'));


/**
 * Start MQTT-Broker
 */
var broker = require('./config/mqtt-broker.js').broker;
var messages = require('./config/mqtt-message-handler');
