var app = angular.module("gwot-vst");


// LIST
app.controller("SensorListController", function($scope, $rootScope, $sensorService) {

/**
 * Load Sensors
 */
$scope.load=function(){

  // Request private sensors, if authenticated user
  if($rootScope.authenticated_user){
    $sensorService.list_private($rootScope.authenticated_user.token,
    $rootScope.authenticated_user.username,
    "?public=true").success(function (response) {
      $scope.sensors = response;
    }).error(function (err) {
      $scope.err = err;
    });
  } else {

    // Request only public sensors
    $sensorService.list_public().success(function (response) {
      $scope.sensors = response;
    }).error(function (err) {
      $scope.err = err;
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
    $rootScope.$on('update', function () {
        $scope.load();
    });

});
