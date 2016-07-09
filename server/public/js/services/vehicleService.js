var app = angular.module("vehicleService", []);

/**
 * Vehicle Service Provider
 */
app.factory('$vehicleService', function($http, config) {

    return {

        list: function(query) {
            var _query = "";
            if(query){
                _query = "?category=" + query;
            }
            return $http.get(config.apiURL + "/vehicles" + _query);
        },
        get: function(vehicle_id) {
            return $http.get(config.apiURL + "/vehicles/" + vehicle_id);
        }

    };

});
