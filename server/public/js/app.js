var app = angular.module("gwot-vst", [

        // External Modules
        "ngRoute",
        "pascalprecht.translate",

        // Own Modules
        //"routes"
        "languages"

    ]
);


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


// Start App
app.run(function($translate) {

    // Use Translator and set
    $translate.use('en_US');

});
