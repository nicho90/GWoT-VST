var pg = require('pg');
var jwt = require('jsonwebtoken');
var secret = require('./../config/secret');
var db_settings = require('../server.js').db_settings;


// POST
exports.request = function(req, res){

    // Check if username and password exit
    if(req.body.username == undefined || req.body.username == "" ){
        res.status(400).send({
            message: 'No Username'
        });
    } else if (req.body.password == undefined || req.body.password == ""){
        res.status(400).send({
            message: 'No Password'
        });
    } else {
        // Create URL
        var url = "postgres://" + db_settings.user + ":" + db_settings.password + "@" + db_settings.host + ":" + db_settings.port + "/" + db_settings.database_name;

        // Connect to Database
        pg.connect(url, function(err, client, done) {
            if(err) {
                console.error('Error fetching client from pool', err);
            } else {

                // Database Query
                client.query('SELECT * FROM users WHERE username=$1;', [req.body.username], function(err, result) {
                    done();

                    if(err) {
                        console.error('Error running query: ', err);
                        res.status(401).json({
                            message: 'Error running query',
                            error: err
                        });
                        return
                    } else {

                        // Check if user exist
                        if(result.rows.length == 0) {
                            res.status(404).send({
                                message: 'User not found'
                            });
                        } else {

                            var user = result.rows[0];

                            // Validate password
                            if(user.password == req.body.password){

                                // Create Access-Token
                                user.token = jwt.sign({username: user.username, password: user.password}, secret.key, {
                                    expiresIn: '1d' // Default: 1 day
                                });

                                res.status(200).send(user);

                            } else {
                                res.status(401).send({
                                    message: 'Wrong password'
                                });
                            }
                        }
                    }
                });
            }
        });
    }
};
