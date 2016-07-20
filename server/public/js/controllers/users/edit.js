var app = angular.module("gwot-vst");


// EDIT
app.controller("UserEditController", function($scope, $rootScope, $location, $translate, $filter, $userService, $verificationService, config) {

    /**
     * Load function
     */
    $scope.load = function(){

        // Check if User is authenticated
        if (!$rootScope.authenticated_user) {
            $location.url("/");
        } else {

            // Load User
            $userService.get($rootScope.authenticated_user.token, $rootScope.authenticated_user.username).success(function(response){
                $scope.user = response;
                $scope._username = $scope.user.username;
            }).error(function(err) {
                $scope.err = err;
            });
        }

    };


    /**
     * Save
     */
    $scope.save = function(){

        $userService.edit($rootScope.authenticated_user.token, $scope._username, $scope.user).success(function(response){

            // Update all Controllers
            $scope.user = response;
            $rootScope.authenticated_user = response;
            $rootScope.$broadcast('updateUser');

            $rootScope.alert = {
                status: 1,
                info: "Success ",
                message: "Your profile has been updated!" // TODO: translate
            };
            $rootScope.$broadcast('alert');

            // Redirect
            $location.url("/users/" + $rootScope.authenticated_user.username);

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
     * Check Username
     */
    $scope.checkUsername = function(username){
        if(username === $scope.username){
            $scope.username_available = "undefined";
        } else if(username === $scope._username){
            $scope.username_available = true;
        } else {
            $verificationService.verify_username(username).success(function(response){
                $scope.username_available = response;
            }).error(function(err) {
                $scope.err = err;
            });
        }
    };


    /**
     * Cancel
     */
    $scope.cancel = function(){

        // Reset
        delete $scope.user;

        // Redirect
        $location.url("/users/" + $rootScope.authenticated_user.username);
    };


    /**
     * Init
     */
    $scope.load();
    $scope.username_available = true;

});
