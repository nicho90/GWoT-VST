var app = angular.module("gwot-vst", [

    // App Settings
    "config",

    // External Modules
    "ngRoute",
    "pascalprecht.translate",
    "leaflet-directive",
    "n3-line-chart",
    "btford.socket-io",

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
 * Sockets
 */
app.factory('$socket', function (socketFactory) {
  console.log(socketFactory);
  return socketFactory();
});


// Start App
app.run(function($translate) {

    // Use Translator and set
    $translate.use('en_US');

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
