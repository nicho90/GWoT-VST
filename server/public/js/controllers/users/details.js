var app = angular.module("gwot-vst");


// DETAILS
app.controller("UserDetailsController", function($scope, $rootScope, $routeParams, $location, $translate, $filter, $userService, $thresholdService, $sensorService, config) {


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
     * @param  {number} sensor_id [description]
     */
    $scope.editSensor = function(sensor_id){
        $location.url("/sensors/" + sensor_id + "/edit");
    };


    /**
     * Delete a Sensor
     * @return {sensor} [The Sensor object, which has to been deleted]
     */
    $scope.deleteSensor = function(sensor){
        // TODO:
    };


    /**
     * Delete all Sensors
     */
    $scope.deleteAllSensors = function(){
        // TODO:
    };



    /**
     * Init
     */
    $scope.tab = 1;
    $scope.load();
});
