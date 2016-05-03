var program = require('commander');
var path = require('path');


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

console.log(program.postgres_user);
console.log(program.postgres_password);

if(program.postgres_user != "" && program.postgres_password != ""){
    db_settings.status = true;
    db_settings.user = program.postgres_user;
    db_settings.password = program.postgres_password;
    exports.db_settings = db_settings;

    console.log(db_settings);
}

// Check if a SMTP-address and Password were set, otherwise run only simple webserver without REST-API
var email_settings = {
    status : false,
    user: "",
    password: ""
};
if(program.email_user && program.email_password){
    email_settings.status = true;
    email_settings.user = program.email_user;
    email_settings.password = program.email_password;
    exports.email_settings = email_settings;
}


/**
 * Start Express-Webserver
 */
var express = require('express');
var app = express();
var server = require('http').createServer(app);

// Set Server-Port
var port = process.env.PORT || 3000;
server.listen(port, function () {
    console.log('Webserver is listening at port %d', port);
});

// Set Webserver-Settings
app.use(bodyParser({
    limit: 100000 // Maximum file-size: 100000KB = ~100MB (default: 100kb)
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

// Set folder for static files (WebClient)
app.use(express.static(__dirname + '/public'));



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

    exports.db = require('./config/db').getDatabase();
    console.log('REST-API is listening at endpoint /api/...');

    // TODO:
    // Implement Routes & Controllers

    // Load dependencies
    // var sensors = require ('./routes/sensors');

    // Load Routes
    // app.use('/api', sensors); // sensors

} else {
    console.log("Simple Webserver, no REST-API");
}



/**
 * Start MQTT-Broker
 */
var broker = require('./config/mqtt-broker.js').broker;
var messages = require('./config/mqtt-message-handler');
