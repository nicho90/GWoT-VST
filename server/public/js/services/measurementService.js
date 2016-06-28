var app = angular.module("measurementService", []);

/**
 * Measurement Service Provider
 */
app.factory('$measurementService', function($http, config) {

    return {

        list: function(token, sensor_id, query) {
            return $http.get(config.apiURL + "/sensors/" + sensor_id + "/measurements" + query, {
                headers: { 'authorization': token }
            });
        },

        get_latest: function(token, sensor_id) {
            return $http.get(config.apiURL + "/sensors/" + sensor_id + "/latest/measurement", {
                headers: { 'authorization': token }
            });
        }

    };

});
