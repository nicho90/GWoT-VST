var app = angular.module("gwot-vst");


/**
 * Navbar Controller
 * @param  {[type]} "NavController"  [description]
 * @param  {[type]} function($scope, $translate    [description]
 * @return {[type]}                  [description]
 */
app.controller("NavController", function($scope, $translate, $location, config) {

    /**
     * Load App Configuration
     * @type {[type]}
     */
    $scope.config = config;
    
    /**
     * Highlight Menu Button if View is Active
     * @param  {[type]} viewLocation [description]
     * @return {[Boolean]}              [description]
     */
        $scope.isActive=function(viewLocation){
          return viewLocation===$location.path();
        };

});
