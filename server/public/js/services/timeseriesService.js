var app = angular.module("timeseriesService", []);

/**
 * Timeseries Service Provider
 */
app.factory('$timeseriesService', function($http, config) {

    return {

        list: function(token, sensor_id, query) {
            return $http.get(config.apiURL + "/sensors/" + sensor_id + "/timeseries" + query, {
                headers: { 'authorization': token }
            });
        }

    };

});
