var app = angular.module("subscriptionService", []);

/**
 * Subscription Service Provider
 */
app.factory('$subscriptionService', function($http, config) {

    return {

        // New Subscription
        getDefault: function() {
            return {
                sensor_id: null,
                threshold_id: null,
                active: true
            };
        },

        list: function(token, username) {
            return $http.get(config.apiURL + "/users/" + username + "/subscriptions", {
                headers: { 'authorization': token }
            });
        },
        create: function(token, username, data) {
            return $http.post(config.apiURL + "/users/" + username + "/subscriptions", data, {
                headers: {
                    'authorization': token,
                    'content-type': 'application/json'
                }
            });
        },
        get: function(token, username, subscription_id) {
            return $http.get(config.apiURL + "/users/" + username + "/subscriptions/" + subscription_id, {
                headers: { 'authorization': token }
            });
        },
        edit: function(token, username, subscription_id, data) {
            return $http.put(config.apiURL + "/users/" + username + "/subscriptions/" + subscription_id, data, {
                headers: {
                    'authorization': token,
                    'content-type': 'application/json'
                }
            });
        },
        delete: function(token, username, subscription_id) {
            return $http.delete(config.apiURL + "/users/" + username + "/subscriptions/" + subscription_id, {
                headers: { 'authorization': token }
            });
        },
        deleteAll: function(token, username) {
            return $http.delete(config.apiURL + "/users/" + username + "/subscriptions", {
                headers: { 'authorization': token }
            });
        }
    };

});
