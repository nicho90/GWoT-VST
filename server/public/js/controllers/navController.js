var app = angular.module("gwot-vst");


/**
 * Navbar Controller
 */
app.controller("NavController", function($scope, $rootScope, $translate, $location, config, $loginService, $thresholdService) {


    /**
     * Highlight Menu Button if View is Active
     */
    $scope.isActive = function(viewLocation){
        return viewLocation===$location.path();
    };


    /**
     * Sign up
     */
    $scope.sign_up = function(){
        $location.url("/new/user");
    };


    /**
     * Reset Authentication
     */
    $scope.resetAuthentication = function(){
        delete $scope.authenticated_user;
        delete $rootScope.authenticated_user;
        $rootScope.$broadcast('update');
        $scope.user = {
            username : "",
            password : ""
        };
    };


    /**
     * Load App Configuration and check user authentication
     */
    $scope.config = config;
    $scope.resetAuthentication();


    /**
     * Login (Authentication)
     */
    $scope.login = function(){

        var validation;
        if($scope.user.username.length !== 0){
            validation = true;
        } else {
            validation = false;
        }

        if($scope.user.password.length !== 0){
            validation = (validation && true);
        } else {
            validation = (validation && false);
        }

        if(validation){
            $loginService.authenticate($scope.user).success(function(response){
                $scope.authenticated_user = response;
                $rootScope.authenticated_user = response;

                // Update Navbar
                $rootScope.$broadcast('update');

                // Load thresholds
                $thresholdService.list($scope.authenticated_user.token, $scope.authenticated_user.username).success(function(response){

                    $scope.authenticated_user.thresholds = response;
                    $rootScope.authenticated_user.thresholds = response;
                    $rootScope.$broadcast('update');

                    // Throw Alert
                    $rootScope.alert = {
                        status: 1,
                        info: "",
                        message: "Hi " + $scope.authenticated_user.first_name + " " + $scope.authenticated_user.last_name
                    };
                    $rootScope.$broadcast('alert');

                }).error(function(err){
                    $scope.err = err;

                    $rootScope.alert = {
                        status: 2,
                        info: "Error ",
                        message: err.message
                    };
                    $rootScope.$broadcast('alert');
                });

            }).error(function(err){

                $rootScope.alert = {
                    status: 2,
                    info: "Error ",
                    message: err.message
                };
                $rootScope.$broadcast('alert');

            });
        } else {

            $rootScope.alert = {
                status: 2,
                info: "Error ",
                message: "Please insert a username and a password!"
            };
            $rootScope.$broadcast('alert');

        }
    };

    /**
     * Logout
     */
    $scope.logout = function(){
        $scope.resetAuthentication();
    };


    /**
     * Close Alert
     */
    $scope.alertClose = function(){
        $scope.isAlert = false;
    };

});
