var app = angular.module("gwot-vst");


// EDIT
app.controller("ThresholdEditController", function($scope, $rootScope, $routeParams, $location, $translate, $userService, $thresholdService, $vehicleService) {


    /**
     * Load funtion
     */
    $scope.load = function(){

        // Check if User is authenticated
        if (!$rootScope.authenticated_user) {
            $location.url("/");
        }

        $scope.vehicles = [];

        // Load threshold
        $thresholdService.get($rootScope.authenticated_user.token, $rootScope.authenticated_user.username, $routeParams.threshold_id).success(function(response){
            $scope.threshold = response;
        }).error(function(err){
            $scope.err = err;

            // Show Alert
            $rootScope.alert = {
                status: 2,
                info: "Error ",
                message: err.message
            };
            $rootScope.$broadcast('alert');
        });

    };


    /**
     * Set Threshold
     * @param  {object} vehicle [A pre-defined vehicle object]
     */
    $scope.setThreshold = function(vehicle){
        $scope.threshold.description = vehicle.brand + " " + vehicle.name + " (" + vehicle.year + ")";
        $scope.threshold.warning_threshold = vehicle.warning_height;
        $scope.threshold.critical_threshold = vehicle.critical_height;
    };


    /**
     * Change the Category
     * @param  {string} category [The category for filtering the ]
     */
    $scope.changeCategory = function(category){

        var query = "";
        switch (category) {
            case 'BIKE':
                query = 'bike';
                break;
            case 'WHEELCHAIR':
                query = 'wheelchair';
                break;
            case 'SCOOTER':
                query = 'scooter';
                break;
            case 'MOTORBIKE':
                query = 'motorbike';
                break;
            case 'CAR':
                query = 'car';
                break;
            case 'BUS':
                query = 'bus';
                break;
            case 'TRUCK':
                query = 'truck';
                break;
            default: {
                query = "";
            }
        }

        // Load vehicles
        $vehicleService.list(query).success(function(response){
            $scope.vehicles = response;
        }).error(function(err){
            $scope.err = err;
        });
    };


    /**
     * Save
     */
    $scope.save = function(){

        $thresholdService.edit($rootScope.authenticated_user.token, $rootScope.authenticated_user.username, $routeParams.threshold_id, $scope.threshold).success(function(response){

            // Reset
            delete $scope.threshold;

            // Update all Controllers
            $rootScope.$broadcast('updateThresholds');

            // Show Alert
            $rootScope.alert = {
                status: 1,
                info: "Success ", // TODO: translate
                message: "Your new Threshold has been updated!" // TODO: translate
            };
            $rootScope.$broadcast('alert');

            // Redirect to
            $location.url("/users/" + $rootScope.authenticated_user.username + "/" + 2);

        }).error(function(err){
            $scope.err = err;

            // Show Alert
            $rootScope.alert = {
                status: 2,
                info: "Error ",
                message: err.message
            };
            $rootScope.$broadcast('alert');

        });
    };


    /**
     * Cancel
     */
    $scope.cancel = function(){
        delete $scope.threshold;
        $location.url("/");
    };


    /**
     * Init
     */
    $scope.load();
});
