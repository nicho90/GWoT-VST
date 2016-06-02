var app = angular.module("timeseriesService", []);

/**
 * Timeseries Service Provider
 */
app.factory('$timeseriesService', function($http, config) {

    return {
        get: function(sensor_id, query) {
            return $http.get(config.apiURL + "/sensors/" + sensor_id + "/timeseries" + query);
        }
    };

});
