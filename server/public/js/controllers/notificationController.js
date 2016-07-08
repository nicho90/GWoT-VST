var app = angular.module("gwot-vst");


/**
 * Notification Controller: Checks incomming socket notifications and alerts if user matches subscription
 */
app.controller("NotificationController", function($scope, $rootScope, $timeout, $translate, $filter, $socket, toastr) {

    /**
     * Check if User is authenticated
     */
    var username;
    $rootScope.$on('update', function() {
        if ($rootScope.authenticated_user) {
            username = $rootScope.authenticated_user.username;
        } else {
            username = "";
        }
        //console.log("Authenticated user: ", $rootScope.authenticated_user);
    });


    /**
     * Receiving notifications when specific thresholds are reached
     */
    $socket.on('/notification/threshold', function(data) {
        console.log("Threshold notification received: ", data);
        // check logged in user
        if (data.creator == username) {
            // Define message content dynamically as HTML
            var message = '<table style="font-size: 0.8em">' +
                '<tr>' +
                '<td>' + $filter('translate')("SENSOR_NOTIFICATION") + ': </td>' +
                '<td>' + data.device_id + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>' + $filter('translate')("HEIGHT_NOTIFICATION") + ': </td>' +
                '<td>' + data.height + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>' + $filter('translate')("DESCRIPTION_NOTIFICATION") + ': </td>' +
                '<td>' + data.description + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>' + $filter('translate')("CATEGORY_NOTIFICATION") + ': </td>' +
                '<td>' + data.category + '</td>' +
                '</tr>' +
                '</table>';
            if (data.level == "warning") {  // Throw warning notifications
                console.log("Warning level notification");
                toastr.warning(message, $filter('translate')("WARNING_NOTIFICATION"));
            } else if (data.level == "danger") {  // Throw danger notifications
                console.log("Danger level notification");
                toastr.error(message, $filter('translate')("CRITICAL_NOTIFICATION"));
            }
        }
    });

});
