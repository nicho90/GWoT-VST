var app = angular.module("serviceStationService", []);

/**
 * Service-Station Provider
 */
app.factory('$serviceStationService', function($http, config) {

    return {

        list: function() {
            return $http.get(config.apiURL + "/service_stations");
        },
        get: function(service_station_id) {
            return $http.get(config.apiURL + "/service_stations/" + service_station_id);
        },

        // Nearby Service-Stations of a Sensor
        get_service_stations: function(token, sensor_id) {
            return $http.get(config.apiURL + "/sensors/" + sensor_id + "/service_stations", {
                headers: { 'authorization': token }
            });
        }

    };

});
