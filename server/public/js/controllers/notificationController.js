var app = angular.module("gwot-vst");


/**
 * Alert Controller
 */
app.controller("NotificationController", function($scope, $rootScope, $timeout, $socket) {


    /*
     * Receiving notifications when specific thresholds are reached
     */
    $socket.on('/notification/threshold', function(data) {
        console.log("Threshold notification received: ", data);
        $rootScope.alert = {
            status: 1,
            info: "Error ",
            message: "Message"
        };
        $rootScope.$broadcast('alert');
    });

});
