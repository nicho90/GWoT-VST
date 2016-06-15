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
 * Sockets
 */
app.factory('$socket', ['$rootScope', function($rootScope) {

    var socket = io.connect();

    return {
        on: function(eventName, callback) {
            socket.on(eventName, callback);
        },
        emit: function(eventName, data) {
            socket.emit(eventName, data);
            console.log("Socket emitted. Topic:", eventName, "; Data:", data);
        }
    };
}]);



/**
 * Start application
 */
app.run(function($translate, config) {

    // Use Translator and set Language
    $translate.use(config.appLanguage);

});
