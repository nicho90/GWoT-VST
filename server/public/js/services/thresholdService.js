var app = angular.module("thresholdService", []);

/**
 * Threshold Service Provider
 */
app.factory('$thresholdService', function($http, config) {

    return {
        list: function(token, username) {
            return $http.get(config.apiURL + "/users/" + username + "/thresholds", {
                headers: { 'token': token }
            });
        }
    };

});
