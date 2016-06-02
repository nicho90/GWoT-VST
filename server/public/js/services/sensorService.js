var app = angular.module("sensorService", []);

/**
 * Sensor Service Provider
 */
app.factory('$sensorService', function($http, config) {

    return {
        list_public: function() {
            return $http.get(config.apiURL + "/sensors");
        },
        list_private: function(token, username, query) {
            return $http.get(config.apiURL + "/users/" + username + "/sensors" + query, {
                headers: { 'token': token }
            });
        },
        get_public: function(sensor_id) {
            return $http.get(config.apiURL + "/sensors/" + sensor_id);
        },
        get_private: function(token, username, sensor_id) {
            return $http.get(config.apiURL + "/users/" + username + "/sensors/" + sensor_id, {
                headers: { 'token': token }
            });
        },
        get_related_stations: function(sensor_id) {
            return $http.get(config.apiURL + "/sensors/" + sensor_id + "/related_stations");
        },
        get_emergency_stations: function(sensor_id) {
            return $http.get(config.apiURL + "/sensors/" + sensor_id + "/emergency_stations");
        },
        get_service_stations: function(sensor_id) {
            return $http.get(config.apiURL + "/sensors/" + sensor_id + "/service_stations");
        }
    };
});
