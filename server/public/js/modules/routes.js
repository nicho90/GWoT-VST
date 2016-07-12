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

        // Go to sensor on map
        .when("/map/:sensor_id", {
            templateUrl: "/js/templates/home.html",
            controller: "HomeController"
        })

        // Help
        .when("/help", {
            templateUrl: "/js/templates/help.html",
            controller: "HelpController"
        })

        // About
        .when("/about", {
            templateUrl: "/js/templates/about.html",
            controller: "AboutController"
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
        /*.when("/sensors/:sensor_id/edit", {
            templateUrl: "/js/templates/sensors/edit.html",
            controller: "SensorEditController"
        })*/
        .when("/new/sensor", {
            templateUrl: "/js/templates/sensors/create.html",
            controller: "SensorCreateController"
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
        .when("/users/:username/edit", {
            templateUrl: "/js/templates/users/edit.html",
            controller: "UserEditController"
        })
        .when("/users/:username/tab/:tab", {
            templateUrl: "/js/templates/users/details.html",
            controller: "UserDetailsController"
        })


        // Thresholds
        .when("/new/threshold", {
            templateUrl: "/js/templates/thresholds/create.html",
            controller: "ThresholdCreateController"
        })
        .when("/thresholds/:threshold_id/edit", {
            templateUrl: "/js/templates/thresholds/edit.html",
            controller: "ThresholdEditController"
        })



        // Redirect
        .otherwise({
            redirectTo: "/"
        });
});
