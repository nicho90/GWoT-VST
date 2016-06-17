var app = angular.module("gwot-vst");


/**
 * User Details Controller
 *  */
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
            });
        }
    };
    $scope.changeTab = function(tab) {
        $scope.tab = tab;
    };

    /**
     * Init
     */
    $scope.tab = 1;
    $scope.load();
});
