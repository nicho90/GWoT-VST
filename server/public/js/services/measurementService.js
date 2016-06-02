var app = angular.module("measurementService", []);

/**
 * Measurement Service Provider
 */
app.factory('$measurementService', function($http, config) {

    return {
        list: function(sensor_id) {
            return $http.get(config.apiURL + "/sensors/" + sensor_id + "/measurements");
        },
        get: function(sensor_id, query) {
            return $http.get(config.apiURL + "/sensors/" + sensor_id + "/measurements" + query);
        }
    };

});
