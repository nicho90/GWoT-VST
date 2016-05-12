var app = angular.module("languages", []);


app.config(function($translateProvider) {

    $translateProvider.translations('de_DE', {

        WELCOME: 'Willkommen',
        SENSORS: 'Sensoren'

    });

    $translateProvider.translations('en_US', {

        WELCOME: 'Welcome',
        SENSORS: 'Sensors'

    });

    // Default Language (English)
    $translateProvider.preferredLanguage('en_US');
});
