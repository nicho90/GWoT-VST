var nodemailer = require('nodemailer');
var email_settings = require('../server.js').email_settings;


/**
 * Local SMTP Configuration
 */
var smtpConfig = {
    // pool: true,
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: email_settings.user,
        pass: email_settings.password
    }
};


// Create reusable transporter object using the default SMTP transport
exports.transporter = nodemailer.createTransport(smtpConfig);

// Default Mail options
exports.mailOptions = { from: 'APP-NAME <' + user + '>' };
// TODO:
// Find a name for our application
