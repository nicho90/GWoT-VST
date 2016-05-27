var app = angular.module("languages", [ "config" ]);

/**
 * Translate Provider
 */
app.config(function($translateProvider, config) {

    $translateProvider.translations('de_DE', {

        WELCOME: 'Willkommen',
        SENSORS: 'Sensoren',
        NONE: 'keine',
        HOME:'Startseite',
        THRESHOLDS:'Grenzwerte'

    });

    $translateProvider.translations('en_US', {

        WELCOME: 'Welcome',
        SENSORS: 'Sensors',
        NONE: 'none',
        HOME:'Home',
        THRESHOLDS:'Thresholds'

    });

    // Set Default Language (English)
    $translateProvider.preferredLanguage(config.appLanguage);
});
