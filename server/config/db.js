/**
 * Configurate and connect Webserver to PostgreSQL-Database
 * Username and Password has to be specified in the Command-Line-Parameters
 */
module.exports = {
    getDatabase: function() {
        var pg = require('pg');
        var db_settings = require('../server.js').db_settings;

        // Local settings
        db_settings.host = "127.0.0.1";
        db_settings.port = "5432";
        db_settings.database_name = "vst";

        // Create URL
        var url = "postgres://" + db_settings.user + ":" + db_settings.password + "@" + db_settings.host + ":" + db_settings.port + "/" + db_settings.database_name;

        // Start
        pg.connect(url, function(err, client, done) {
            if(err) {
                return console.error('Error fetching client from pool', err);
            } else {
                console.log('PostgreSQL-Database is listening at port ' + db_settings.port);
                return {
                    client: client,
                    done: done
                };
            }
        });
    }
}
