var app = angular.module("gwot-vst");


// LIST
app.controller("SensorListController", function($scope,$sensorService) {

/**
 * Load Sensors
 * @return {[type]} [description]
 */
$scope.load=function(){
  $sensorService.list().success(function(response){
    $scope.sensors=response;
  }).error(function(err){
    $scope.err=err;
  });
};

// Init
$scope.sensors=[];
$scope.load();
});
