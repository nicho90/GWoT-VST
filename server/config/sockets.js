/**
 * Socket Message Handler
 */
var io = require('../server.js').io;

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
