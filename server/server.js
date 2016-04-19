var path = require('path');


/**
 * Express-Webserver
 */
var express = require('express');
var app = express();
var server = require('http').createServer(app);


// Set Server-Port
var port = process.env.PORT || 3000;
server.listen(port, function () {
    console.log('Server listening at port %d', port);
});


// Set folder for static files (WebClient)
app.use(express.static(__dirname + '/public'));
