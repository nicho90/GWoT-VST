var app = angular.module("gwot-vst");


// LIST
app.controller("SensorListController", function($scope, $rootScope, $location, $sensorService) {

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
    $scope.showDetails = function(sensor_id){
        $location.url("/sensors/" + sensor_id);
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
     */
    $scope.edit = function(sensor_id){
        $location.url("/sensors/" + sensor_id + "/edit");
    };


    /**
     * Delete a Sensor
     */
    $scope.delete = function(){
        // TODO
    };


    /**
     * Init
     */
    $scope.load();


    /**
     * Update when user logged in or out
     */
    $rootScope.$on('update', function(){
        $scope.load();
    });
});
