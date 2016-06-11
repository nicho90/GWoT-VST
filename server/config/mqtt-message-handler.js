var broker = require('./mqtt-broker.js').broker;
var moscaSettings = require('./mqtt-broker.js').moscaSettings;
var postprocessScheduled = require('./postprocess-scheduled.js');
var postprocessRealtime = require('./postprocess-realtime.js');
var db_settings = require('../server.js').db_settings;
var pg = require('pg');

if (broker !== undefined) {

    // Start
    broker.on('ready', function() {
        console.log('Mosca-Broker is listening at port ' + moscaSettings.port);
    });

    // Create URL
    var url = "postgres://" + db_settings.user + ":" + db_settings.password + "@" + db_settings.host + ":" + db_settings.port + "/" + db_settings.database_name;

    // Client Connect
    broker.on('clientConnected', function(client) {
        console.log('Client connected', client.id);
        // Connect to Database
        pg.connect(url, function(err, pgclient, done) {
            if (err) {
                return console.error(errors.database.error_1.message, err);
            } else {
                // Database query
                pgclient.query('UPDATE Sensors SET online_status=true WHERE sensor_id=$1;', [
                    client.id
                ], function(err, result) {
                    done();
                    if (err) {
                        console.error(errors.database.error_4.message, err);
                        callback(new Error(errors.database.error_4.message));
                    } else {
                        console.log("Online status changes for " + client.id + ": true");
                    }
                });
            }
        });
        // TODO: send Websocket-Message
    });

    // Client Disconnect
    broker.on('clientDisconnected', function(client) {
        console.log('Client disconnected', client.id);
        // Connect to Database
        pg.connect(url, function(err, pgclient, done) {
            if (err) {
                return console.error(errors.database.error_1.message, err);
            } else {
                // Database query
                pgclient.query('UPDATE Sensors SET online_status=false WHERE sensor_id=$1;', [
                    client.id
                ], function(err, result) {
                    done();
                    if (err) {
                        console.error(errors.database.error_4.message, err);
                        callback(new Error(errors.database.error_4.message));
                    } else {
                        console.log("Online status changes for " + client.id + ": false");
                    }
                });
            }
        });
        // TODO: send Websocket-Message
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
            postprocessScheduled.process(packet.payload);
        } else if (packet.topic == "/sensor/realtime/measurement") {
            console.log('Message realtime measurement', packet.payload.toString());
            // Here are the realtime measurment messages incomming
            // TODO handle incomming data
        }

    });
}


module.exports = broker;
