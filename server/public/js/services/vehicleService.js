var app = angular.module("vehicleService", []);

/**
 * Vehicle Service Provider
 */
app.factory('$vehicleService', function($http, config) {

    return {

        list: function() {
            return $http.get(config.apiURL + "/vehicles");
        },
        get: function(vehicle_id) {
            return $http.get(config.apiURL + "/vehicles/" + vehicle_id);
        }
        
    };

});
