var app = angular.module("gwot-vst");


/**
 * Notification Controller: Checks incomming socket notifications and alerts if user matches subscription
 */
app.controller("NotificationController", function($scope, $rootScope, $timeout, $socket) {

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
            console.log("username " + username + " correct.");
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
                //toastr.warning("Message", "Warning");
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
                //toastr.error("Message", "Danger");
            }
        }
    });

});
