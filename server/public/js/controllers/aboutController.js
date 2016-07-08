var app = angular.module("gwot-vst");


/**
 * About Controller
 */
app.controller("AboutController", function($scope, $rootScope, $translate, $location, config) {

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
