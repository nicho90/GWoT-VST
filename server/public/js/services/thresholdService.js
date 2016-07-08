var app = angular.module("thresholdService", []);

/**
 * Threshold Service Provider
 */
app.factory('$thresholdService', function($http, config) {

    return {

        // New Threshold
        getDefault: function() {
            return {
                    description: "",
                    warning_threshold: 0,
                    critical_threshold: 0,
                    category: "OTHER"
            };
        },

        list: function(token, username) {
            return $http.get(config.apiURL + "/users/" + username + "/thresholds", {
                headers: { 'authorization': token }
            });
        },
        create: function(token, username, data) {
            return $http.post(config.apiURL + "/users/" + username + "/thresholds", data, {
                headers: {
                    'authorization': token,
                    'content-type': 'application/json'
                }
            });
        },
        get: function(token, username, threshold_id) {
            return $http.get(config.apiURL + "/users/" + username + "/thresholds/" + threshold_id, {
                headers: { 'authorization': token }
            });
        },
        edit: function(token, username, threshold_id, data) {
            return $http.put(config.apiURL + "/users/" + username + "/thresholds/" + threshold_id, data, {
                headers: {
                    'authorization': token,
                    'content-type': 'application/json'
                }
            });
        },
        delete: function(token, username, threshold_id) {
            return $http.delete(config.apiURL + "/users/" + username + "/thresholds/" + threshold_id, {
                headers: { 'authorization': token }
            });
        },
        deleteAll: function(token, username) {
            return $http.delete(config.apiURL + "/users/" + username + "/thresholds", {
                headers: { 'authorization': token }
            });
        }
    };

});
