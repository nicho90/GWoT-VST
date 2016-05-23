var program = require('commander');
var path = require('path');
var _ = require('underscore');


/**
 * Check Command-Line parameters
 */
program
    .version('1.0.0')
    .option('-d, --dev', 'Use local development database')
    .option('-m, --mongodb', 'Use MongoDB database')
    .option('-r, --redis', 'Use Redis database')
    .option('-dbu, --postgres_user [username]', 'Enter the PostgreSQL-User, which is needed to start REST-API', 'admin')
    .option('-dbpw, --postgres_password [password]', 'Enter the PostgreSQL-Password, which is needed to start REST-API', 'password')

    // TODO:
    // Add the following parameters
    //.option('-ex, --examples', 'Add example-data to the PostgreSQL-Database')
    //.option('-c, --clean', 'Delete all entries in the PostgreSQL-Database')

    .option('-emu, --email_user [email-address]', 'Enter the SMTP-address, which is needed to start the Email-Notification-Service (example: user@gmail.com)', 'user@gmail.com')
    .option('-empw, --email_password [password]', 'Enter the Email-Password, which is needed to start Email-Notification-Service', 'password')
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
    pubSubOption = "";
}
exports.pubSubOption = pubSubOption;

// Check if Postgres-User and Postgres-Password were set, otherwise run only simple webserver without REST-API
var db_settings = {
    status: false,
    user: "",
    password: ""
};
db_settings = _.extend(db_settings, require('./config/db'));

if(program.postgres_user != "admin" && program.postgres_password != "password"){
    db_settings.status = true;
    db_settings.user = program.postgres_user;
    db_settings.password = program.postgres_password;
    exports.db_settings = db_settings;
}

// Check if a SMTP-address and Password were set, otherwise run only simple webserver without REST-API
var email_settings = {
    status : false,
    user: "",
    password: ""
};
if(program.email_user != "user@gmail.com" && program.email_password != "password"){
    email_settings.status = true;
    email_settings.user = program.email_user;
    email_settings.password = program.email_password;
    exports.email_settings = email_settings;
}



/**
 * Start Express-Webserver
 */
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var server = require('http').createServer(app);

// Set Server-Port
var port = process.env.PORT || 3333;
server.listen(port, function () {
    console.log('Webserver is listening at port %d', port);
});

// Allow-Cross-Origin-Requests
app.all("/api/*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    return next();
});

// Set Webserver-Settings
app.use(bodyParser.json({
    limit: 52428800 // 50MB
}));
app.use(bodyParser.urlencoded({
    extended: false,
    limit: 52428800 // 50MB
}));
app.use(cookieParser());

// Set folder for static files (WebClient)
app.use(express.static(__dirname + '/public'));



/**
 * Start Websocket-Server
 */
var io = require('socket.io')(server);
var web_clients = [];
io.on('connection', function (socket) {

    console.log("Socket connected: " + socket);

    // Add new webClient-User to web_clients[]
    /*web_clients.push({
        id: socket,
        sensor_ids: []
    });
    console.log("New WebClient has been conneted!");


    // Request Real-time data
    socket.on('getRT', function (data) {
        _.findWhere(web_clients, {newsroom: "The New York Times"});
        sensor_ids


         // we tell the client to execute 'new message'
         socket.broadcast.emit('test', {
             username: "Max",
             message: "I wrote this message"
         });
     });

     // when the client emits 'new message', this listens and executes
     /*socket.on('new message', function (data) {
         // we tell the client to execute 'new message'
         socket.broadcast.emit('new message', {
             username: "Max",
             message: "I wrote this message"
         });
     });*/

     // when the user disconnects.. perform this
     socket.on('disconnect', function () {
         console.log("Socket disconnected: " + socket);
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



/**
 * Start Email-Notification-Service
 */
if(db_settings.status && email_settings.status){
    console.log('Email-Notification-Service was started');
}



/**
 * Use REST-API
 */
if(db_settings.status && email_settings.status){

    console.log('PostgreSQL-Database is listening at port ' + db_settings.port);
    console.log('REST-API is listening at endpoint /api/...');

    // Load dependencies
    var login = require ('./routes/login');
    var users = require ('./routes/users');
    var water_bodies = require ('./routes/water_bodies');
    var sensors = require ('./routes/sensors');
    var related_sensors = require ('./routes/related_sensors');
    var measurements = require ('./routes/measurements');
    var timeseries = require ('./routes/timeseries');
    var thresholds = require ('./routes/thresholds');
    var subscriptions = require ('./routes/subscriptions');
    var vehicles = require ('./routes/vehicles');
    var service_stations = require ('./routes/service_stations');
    var emergency_stations = require ('./routes/emergency_stations');

    // Load Routes
    app.use('/api', login);
    app.use('/api', users);
    app.use('/api', water_bodies);
    app.use('/api', sensors);
    app.use('/api', related_sensors);
    app.use('/api', measurements);
    app.use('/api', timeseries);
    app.use('/api', thresholds);
    app.use('/api', subscriptions);
    app.use('/api', vehicles);
    app.use('/api', service_stations);
    app.use('/api', emergency_stations);

} else {
    console.log("Simple Webserver, no REST-API (no Database, no Websockets, no Email-Notification-Service)");
}



/**
 * Start MQTT-Broker
 */
var broker = require('./config/mqtt-broker.js').broker;
var messages = require('./config/mqtt-message-handler');
