/**
 * Socket Message Handler
 */
var io = require('../server.js').io;
var broker = require('./mqtt-message-handler.js');

//console.log("Socket.io activated", io);
io.on('connection', function(socket) {

    console.log("Socket connected:", socket.client.id);

    // On disconnect
    socket.on('disconnect', function() {
        console.log("Socket disconnected:", socket.client.id);
    });

    //  Activating realtime measurements
    socket.on('/data/realtime', function(data) {
        /*
         * Data should look like this:
         {
            device_id: [id],
            status: [bool],
         }
         */
        console.log("Socket received realtime adjusting message: ", data);
        message = {
            topic: '/data/realtime',
            payload: '{"device_id": "' + data.device_id + '","status": ' + data.status + '}', // String or a Buffer
            qa: 1, // quality of service: 0, 1, or 2
            retain: true // or true
        };
        broker.publish(message);
    });
});

exports.sockets = io;
