var app = angular.module("gwot-vst");


/**
 * Notification Controller: Checks incomming socket notifications and alerts if user matches subscription
 */
app.controller("NotificationController", function($scope, $rootScope, $timeout, $translate, $filter, $socket, toastr) {

    /*
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


    /*
     * Receiving notifications when specific thresholds are reached
     */
    $socket.on('/notification/threshold', function(data) {
        console.log("Threshold notification received: ", data);

        // Handle notification depending on data, e.g.
        // { subscription_id: 2, threshold_id: 2, creator: "nicho90", description: "VW Golf (2015)", category: "CAR", level: "danger" }
        if (data.creator == username) {
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
            if (data.level == "warning") {
                console.log("Warning level notification");
                /*
                $rootScope.alert = {
                    status: 3,
                    info: "Error ",
                    message: "Warning message"
                };
                $rootScope.$broadcast('alert');
                */
                // TODO insert notification content
                toastr.warning(message, $filter('translate')("WARNING_NOTIFICATION"));
            } else if (data.level == "danger") {
                console.log("Danger level notification");
                /*
                $rootScope.alert = {
                    status: 2,
                    info: "Error ",
                    message: "Danger message"
                };
                $rootScope.$broadcast('alert');
                */
                // TODO insert notification content
                toastr.error(message, $filter('translate')("CRITICAL_NOTIFICATION"));
            }
        }
    });

});
