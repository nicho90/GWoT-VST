var app = angular.module("emergencyStationService", []);

/**
 * Emergency-Station Provider
 */
app.factory('$emergencyStationService', function($http, config) {

    return {

        list: function() {
            return $http.get(config.apiURL + "/emergency_stations");
        },
        get: function(emergency_station_id) {
            return $http.get(config.apiURL + "/emergency_stations/" + emergency_station_id);
        },

        // Nearby Emergency-Stations of a Sensor
        get_emergency_stations: function(token, sensor_id) {
            return $http.get(config.apiURL + "/sensors/" + sensor_id + "/emergency_stations", {
                headers: { 'authorization': token }
            });
        }

    };

});
