var app = angular.module("gwot-vst");


// CREATE
app.controller("UserCreateController", function($scope, $rootScope, $location, $translate, $userService) {

    /**
     * Redirect, if User is logged in
     */
    if($rootScope.authenticated_user) {
        $location.url("/");
    }


    /**
     * Init
     */
    $scope.user = $userService.getDefault();


    /**
     * Create
     */
    $scope.create = function(){

        $userService.create($scope.user).success(function(response){
            $scope.authenticated_user = response;
            $rootScope.authenticated_user = response;
            $rootScope.$broadcast('update');

            $rootScope.alert = {
                status: 1,
                info: "Success ",
                message: "Your profile has been created!"
            };
            $rootScope.$broadcast('alert');
            $location.url("/");

        }).error(function(err){
            $scope.err = err;
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
        delete $scope.user;
        $location.url("/");
    };

});
