/**
 * Socket Message Handler
 */
var io = require('../server.js').io;
var broker = require('./mqtt-message-handler.js');

console.log("Socket.io activated");
io.on('connection', function(socket) {

    console.log("Socket connected: "+ socket);

    //Testing
    socket.on('test', function(data) {
        console.log("Socket received. Data:", data);
    });

    socket.emit('test', {
        test: "data"
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

    // Activation threshold notifications
    socket.on('/thresholds/activate', function(data) {
        /*
         * Data should look like this:
         {
            status: [bool],
         }
         */
        console.log("Socket received realtime adjusting message: ", data);
        // TODO save a global boolean that can be accessed in the postprocess-scheduled l.263
    });

    // Code for emitting threshold notifications
    socket.emit('/notification/threshold', {
        //TODO
    });

    // Code for emitting realtime data
    socket.emit('/data/realtime', {
        //TODO
    });

    // Add new webClient-User to web_clients[]
    /*web_clients.push({
        id: socket,
        sensor_ids: []
    });
    console.log("New WebClient has been conneted!");*/


    // Request Real-time data
    /*socket.on('getRT', function (data) {
        _.findWhere(web_clients, {newsroom: "The New York Times"});
        sensor_ids


         // we tell the client to execute 'new message'
         socket.broadcast.emit('test', {
             username: "Max",
             message: "I wrote this message"
         });
     });*/

     // when the client emits 'new message', this listens and executes
     /*socket.on('new message', function (data) {
         // we tell the client to execute 'new message'
         socket.broadcast.emit('new message', {
             username: "Max",
             message: "I wrote this message"
         });
     });*/

    // when the user disconnects.. perform this
    socket.on('disconnect', function() {
        console.log("Socket disconnected: "+ socket);
        /*if (addedUser) {
            --numUsers;

            // echo globally that this client has left
            socket.broadcast.emit('user left', {
                username: socket.username,
                numUsers: numUsers
            });
        }*/
    });

    /*var i = 0;
    setInterval(function() {
        socket.broadcast.emit('test', {
            username: "Max",
            message: "I wrote this message"
        });
        console.log('test: ' + '{ "username": "Max", "message": "I wrote this message" }')
    i += 1;
}, 3000);*/
});

exports.sockets = io;
