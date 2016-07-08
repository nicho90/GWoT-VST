var app = angular.module("gwot-vst");


// LIST
app.controller("SensorListController", function($scope, $rootScope, $location, $filter, $ngBootbox, $sensorService) {

    /**
     * Load Sensors
     */
    $scope.load = function() {

        // Check if User is authenticated
        var token = "";
        if ($rootScope.authenticated_user) {
            token = $rootScope.authenticated_user.token;
        }

        // Request only public sensors (or also private sensors of an user, if the user is authenticated)
        $sensorService.list(token).success(function(response) {
            $scope.sensors = response;
        }).error(function(err) {
            $scope.err = err;
        });

    };


    /**
     * Show Details
     * @param  {number} sensor_id [Redirect to sensorDetailsView]
     */
    $scope.showDetails = function(sensor_id) {
        $location.url("/sensors/" + sensor_id);
    };


    /**
     * Show Sensor on map
     * @param  {number} sensor_id [Redirect to homeView, find Sensor and highlight it on map]
     */
    $scope.showOnMap = function(sensor_id) {
        $location.url("/map/" + sensor_id);
    };


    /**
     * Edit a Sensor
     */
    $scope.edit = function(sensor_id) {
        $location.url("/sensors/" + sensor_id + "/edit");
    };


    /**
     * Delete a Sensor
     */
    $scope.delete = function(sensor) {

        // Check if User is authenticated
        var token = "";
        if ($rootScope.authenticated_user) {
            token = $rootScope.authenticated_user.token;

            // Show confirmation dialog
            $ngBootbox.customDialog({
                message:
                    $filter('translate')('DIALOG_DELETE_SENSOR') +
                    '<br><b>' + sensor.description + '</b> <kbd>' +
                    sensor.device_id + '</kbd> ' +
                    $filter('translate')('DIALOG_DELETE_END'),
                title:
                    '<i class="fa fa-exclamation-triangle"></i>&nbsp;&nbsp;' +
                    $filter('translate')('DIALOG_ATTENTION'),
                buttons: {
                    warning: {
                        label: $filter('translate')('CANCEL'),
                        className: "btn-secondary",
                        callback: function() {}
                    },
                    success: {
                        label: $filter('translate')('OK'),
                        className: "btn-primary",
                        callback: function() {
                            $sensorService.delete(token, sensor.sensor_id)
                            .success(function(response) {

                                // Reset Sensors
                                delete $scope.sensors;
                                $scope.loadData();
                            })
                            .error(function(err) {
                                $scope.err = err;
                            });
                        }
                    }
                }
            });
        }
    };


    /**
     * Init
     */
    $scope.load();


    /**
     * Update when user logged in or out
     */
    $rootScope.$on('update', function() {
        $scope.load();
    });
});
