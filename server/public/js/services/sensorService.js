var app = angular.module("sensorService", []);

/**
 * Sensor Service Provider
 */
app.factory('$sensorService', function($http, config) {

    return {

        list: function(token) {
            return $http.get(config.apiURL + "/sensors", {
                headers: { 'authorization': token }
            });
        },
        get: function(token, sensor_id) {
            return $http.get(config.apiURL + "/sensors/" + sensor_id, {
                headers: { 'authorization': token }
            });
        },

        // Sensors of a User
        user_list: function(token, username) {
            return $http.get(config.apiURL + "/users/" + username + "/sensors", {
                headers: { 'authorization': token }
            });
        },
        user_get: function(token, username, sensor_id) {
            return $http.get(config.apiURL + "/users/" + username + "/sensors/" + sensor_id, {
                headers: { 'authorization': token }
            });
        },

        // Related (nearby) Sensors of a Sensor
        get_related_sensors: function(token, sensor_id) {
            return $http.get(config.apiURL + "/sensors/" + sensor_id + "/related_sensors", {
                headers: { 'authorization': token }
            });
        },

        // Nearby Emergency-Stations of a Sensor
        get_emergency_stations: function(token, sensor_id) {
            return $http.get(config.apiURL + "/sensors/" + sensor_id + "/emergency_stations", {
                headers: { 'authorization': token }
            });
        },

        // Nearby Service-Stations of a Sensor
        get_service_stations: function(token, sensor_id) {
            return $http.get(config.apiURL + "/sensors/" + sensor_id + "/service_stations", {
                headers: { 'authorization': token }
            });
        }
    };
});