var app = angular.module("gwot-vst", [

    // App Settings
    "config",

    // External Modules
    "ngRoute",
    "pascalprecht.translate",
    "leaflet-directive",
    "n3-line-chart",

    // Own Modules
    "filters",
    "routes",
    "languages",

    // Services
    "loginService",
    "userService",
    "thresholdService",
    "sensorService",
    "measurementService",
    "timeseriesService",
    "forecastService"
]);


/**
 * Log Provider
 * turn on/off debug logging
 */
app.config(function($logProvider) {
    $logProvider.debugEnabled(false);
});


/**
 * Start application
 */
app.run(function($translate, config) {

    // Use Translator and set Language
    $translate.use(config.appLanguage);

});
