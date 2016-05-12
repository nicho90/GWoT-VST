var app = angular.module("gwot-vst");


// CREATE
app.controller("CreateSensorController", function($scope) {

    $scope.sensors = [];

    // Init
    $scope.sensor = {
        "id": "",
        "description": "",
        "coordinates": {
            "lat": 0.0,
            "lng": 0.0
        }
    };


    // Add to Sensor to list
    $scope.add = function(){
        $scope.sensors.push(
            {
                "id": $scope.sensor.id,
                "description": $scope.sensor.description,
                "coordinates": {
                    "lat": $scope.sensor.coordinates.lat,
                    "lng": $scope.sensor.coordinates.lng
                }
            }
        );
    };


});
