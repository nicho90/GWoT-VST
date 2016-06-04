var app = angular.module("gwot-vst");
​
​
// CREATE
app.controller("CreateThresholdController", function($scope, $rootScope, $location, $translate, $userService, $thresholdService) {
​
​
        /**
         * Redirect
         */
        if($rootScope.authenticated_user) {
            $location.url("/");
        }
​
​
        /**
         * Init
         */
        $scope.threshold = $thresholdService.getDefault();
​
​
        /**
         * Create
         */
        $scope.create = function(){
            // TODO
        };
​
​
        /**
         * Cancel
         */
        $scope.cancel = function(){
            delete $scope.user;
            $location.url("/");
        };
​
​
});
