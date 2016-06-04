var app = angular.module("routes", []);

/**
 * Route Provider
 */
app.config(function($routeProvider) {
    $routeProvider

        // Home (Map)
        .when("/", {
            templateUrl: "/js/templates/home.html",
            controller: "HomeController"
        })


        // Sensors
        .when("/sensors", {
            templateUrl: "/js/templates/sensors/list.html",
            controller: "SensorListController"
        })
        .when("/sensors/:sensor_id", {
            templateUrl: "/js/templates/sensors/details.html",
            controller: "SensorDetailsController"
        })


        // Users
        .when("/new/user", {
            templateUrl: "/js/templates/users/create.html",
            controller: "UserCreateController"
        })
        .when("/users/:username", {
            templateUrl: "/js/templates/users/details.html",
            controller: "UserDetailsController"
        })

//thresholdService
.when("new/threshold",{
  templateUrl: "/js/templates/thresholds/create.html",
  controller:"ThresholdCreateController"
})
        // Redirect
        .otherwise({
            redirectTo: "/"
        });

});
