var app = angular.module("languages", [ "config" ]);


app.config(function($translateProvider, config) {

    $translateProvider.translations('de_DE', {

        WELCOME: 'Willkommen',
        SENSORS: 'Sensoren',
        NONE: 'keine'

    });

    $translateProvider.translations('en_US', {

        WELCOME: 'Welcome',
        SENSORS: 'Sensors',
        NONE: 'none'

    });

    // Set Default Language (English)
    $translateProvider.preferredLanguage(config.appLanguage);
});
