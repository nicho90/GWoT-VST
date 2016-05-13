/**
 * Created by timmimim on 13/05/16.
 */

var app = angular.module("routes", []);

/**
 * Route Provider
 * @param   {[type]}    funtion($routeProvider  [description]
 * @return  {[type]}                            [description]
 */
app.config(function($routeProvider) {
    $routeProvider
    
        //HOME (LOGIN)
        .when("/", {
            templateUrl: "/js/templates/home.html",
            controller: "HomeController"
        })
            
            
        //SENSORS
        .when("/sensors", {
            templateUrl: "/js/templates/sensors/list.html",
            controller: "SensorListController"
        })
    
        .otherwise({
            redirectTo: "/"
        });
    
})