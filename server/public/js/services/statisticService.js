var app = angular.module("statisticService", []);

/**
 * Statistic Service Provider
 */
app.factory('$statisticService', function($http, config) {

    return {

        get: function(token, sensor_id) {
            return $http.get(config.apiURL + "/sensors/" + sensor_id + "/statistics", {
                headers: { 'authorization': token }
            });
        }

    };

});
