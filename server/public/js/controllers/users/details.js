var app = angular.module("gwot-vst");


// DETAILS
app.controller("UserDetailsController", function($scope, $rootScope, $routeParams, $location, $translate, $filter, $ngBootbox, $userService, $thresholdService, $subscriptionService, $sensorService, config) {


    /**
     * Load User
     */
    $scope.load = function() {


        // Check if user is authenticated
        if ($rootScope.authenticated_user) {

            // Request private or public sensor of authenticated user
            $userService.get($rootScope.authenticated_user.token, $routeParams.username)
            .success(function(response) {
                $scope.user = response;

                // Request all Sensors of the User
                $sensorService.user_list($rootScope.authenticated_user.token, $routeParams.username)
                .success(function(response) {
                    $scope.user.sensors = response;
                })
                .error(function(err) {
                    $scope.err = err;
                });

                // Request all Thresholds of the User
                $thresholdService.list($rootScope.authenticated_user.token, $routeParams.username)
                .success(function(response) {
                    $scope.user.thresholds = response;
                })
                .error(function(err) {
                    $scope.err = err;
                });

                // Request all Subscriptions of the User
                $subscriptionService.list($rootScope.authenticated_user.token, $routeParams.username)
                .success(function(response) {
                    $scope.user.subscriptions = response;
                })
                .error(function(err) {
                    $scope.err = err;
                });
            })
            .error(function(err) {
                $scope.err = err;

                // Redirect
                $location.url("/");
            });
        } else {

            // Redirect
            $location.url("/");
        }
    };


    /**
     * Update when user logged in or out
     * @param  {number} tab [The number of the tab]
     */
    $scope.changeTab = function(tab) {
        $scope.tab = tab;
    };


    /**
     * Show Sensor on map
     * @param  {number} sensor_id [Redirect to homeView, find Sensor and highlight it on map]
     */
    $scope.showOnMap = function(sensor_id){
        $location.url("/map/" + sensor_id);
    };


    /**
     * Edit a Sensor
     * @param  {number} sensor_id [Redirect to sensorEditView]
     */
    $scope.editSensor = function(sensor_id){
        $location.url("/sensors/" + sensor_id + "/edit");
    };


    /**
     * Edit a Threshold
     * @param  {number} threshold_id [Redirect to thresholdEditView]
     */
    $scope.editThreshold = function(threshold_id){
        $location.url("/thresholds/" + threshold_id + "/edit");
    };


    /**
     * Show Details of a Sensor
     * @param  {number} sensor_id [Redirect to sensorDetailsView]
     */
    $scope.showDetails = function(sensor_id) {
        $location.url("/sensors/" + sensor_id);
    };


    /**
     * Delete a Sensor
     * @return {sensor} [The Sensor object, which has to been deleted]
     */
    $scope.deleteSensor = function(sensor){

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
                        $sensorService.delete($rootScope.authenticated_user.token, $rootScope.authenticated_user.username, sensor.sensor_id)
                        .success(function(response) {

                            // Reset Sensors
                            $scope.user.sensors = [];
                            $scope.load();
                        })
                        .error(function(err) {
                            $scope.err = err;
                        });
                    }
                }
            }
        });
    };


    /**
     * Delete all Sensors
     */
    $scope.deleteAllSensors = function(){

        // Show confirmation dialog
        $ngBootbox.customDialog({
            message:
                $filter('translate')('DIALOG_DELETE_ALL_SENSORS') + $filter('translate')('DIALOG_DELETE_END'),
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
                        $sensorService.deleteAll($rootScope.authenticated_user.token, $rootScope.authenticated_user.username)
                        .success(function(response) {

                            // Reset Sensors
                            $scope.user.sensors = [];
                            $scope.load();
                        })
                        .error(function(err) {
                            $scope.err = err;
                        });
                    }
                }
            }
        });
    };


    /**
     * Delete a Threshold
     * @return {threshold} [The Threshold object, which has to been deleted]
     */
    $scope.deleteThreshold = function(threshold){

        // Show confirmation dialog
        $ngBootbox.customDialog({
            message:
                $filter('translate')('DIALOG_DELETE_THRESHOLD') +
                '<b>' + threshold.description + '</b>' +
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
                        $thresholdService.delete($rootScope.authenticated_user.token, $rootScope.authenticated_user.username, threshold.threshold_id)
                        .success(function(response) {

                            // Reset Thresholds
                            $scope.user.thresholds = [];
                            $scope.load();
                        })
                        .error(function(err) {
                            $scope.err = err;
                        });
                    }
                }
            }
        });
    };

    /**
     * Delete all Thresholds
     */
    $scope.deleteAllThresholds = function(){

        // Show confirmation dialog
        $ngBootbox.customDialog({
            message:
                $filter('translate')('DIALOG_DELETE_ALL_THRESHOLDS') + $filter('translate')('DIALOG_DELETE_END'),
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
                        $thresholdService.deleteAll($rootScope.authenticated_user.token, $rootScope.authenticated_user.username)
                        .success(function(response) {

                            // Reset Thresholds
                            $scope.user.thresholds = [];
                            $scope.load();
                        })
                        .error(function(err) {
                            $scope.err = err;
                        });
                    }
                }
            }
        });
    };


    /**
     * Delete a Subscription
     * @return {subscription} [The Threshold object, which has to been deleted]
     */
    $scope.deleteSubscription = function(subscription){

        // Show confirmation dialog
        $ngBootbox.customDialog({
            message:
                $filter('translate')('DIALOG_DELETE_SUBSCRIPTION'),
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
                        $subscriptionService.delete($rootScope.authenticated_user.token, $rootScope.authenticated_user.username, subscription.subscription_id)
                        .success(function(response) {

                            // Reset Subscriptions
                            $scope.user.subscriptions = [];
                            $scope.load();
                        })
                        .error(function(err) {
                            $scope.err = err;
                        });
                    }
                }
            }
        });
    };

    /**
     * Delete all Subscriptions
     */
    $scope.deleteAllSubscriptions = function(){

        // Show confirmation dialog
        $ngBootbox.customDialog({
            message:
                $filter('translate')('DIALOG_DELETE_ALL_SUBSCRIPTIONS'),
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
                        $subscriptionService.deleteAll($rootScope.authenticated_user.token, $rootScope.authenticated_user.username)
                        .success(function(response) {

                            // Reset Subscriptions
                            $scope.user.subscriptions = [];
                            $scope.load();
                        })
                        .error(function(err) {
                            $scope.err = err;
                        });
                    }
                }
            }
        });
    };



    /**
     * Init
     */
    $scope.load();

    // Check if tab was preselected
    if($routeParams.tab && $routeParams.tab >= 1 && $routeParams.tab <= 4){
        $scope.tab = $routeParams.tab;
    } else {
        $scope.tab = 1;
    }
});
