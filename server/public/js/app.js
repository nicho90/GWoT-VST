var app = angular.module("gwot-vst", [

    // App Settings
    "config",

    // External Modules
    "ngRoute",
    "pascalprecht.translate",
    "leaflet-directive",
    "n3-line-chart",
    "btford.socket-io",
    "underscore",
    "ngAnimate",
    "toastr",
    "ngBootbox",

    // Own Modules
    "filters",
    "routes",
    "languages",

    // Services
    "loginService",
    "userService",
    "thresholdService",
    "sensorService",
    "subscriptionService",
    "measurementService",
    "statisticService",
    "timeseriesService",
    "forecastService",
    "vehicleService"
]);


/**
 * Sockets
 */
app.factory('$socket', function(socketFactory) {
    return socketFactory();
});


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


/**
 * Configure toastr notifications
 */
app.config(function(toastrConfig) {
    angular.extend(toastrConfig, {
        timeOut: "60000",
        extendedTimeOut: "60000",
        newestOnTop: false,
        positionClass: 'toast-top-center',
        closeButton: true,
        showDuration : "100",
		    hideDuration : "1000",
        showEasing: "swing",
        hideEasing: "linear",
        progressBar: true,
        allowHtml: true,
    });
});
