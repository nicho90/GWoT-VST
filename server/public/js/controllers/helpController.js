var app = angular.module("gwot-vst");


/**
 * Help Controller
 */
app.controller("HelpController", function($scope, $rootScope, $translate, $location, config) {

    /**
     * Init
     */
    $scope.config = config;

    
    /**
     * Redirect
     */
    $scope.redirectTo = function(){
        $location.url("/");
    };


});
