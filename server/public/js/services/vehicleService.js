var app = angular.module("vehicleService", []);

/**
 * Vehicle Service Provider
 */
app.factory('$vehicleService', function($http, config) {

    return {
        /*getDefault: function() {
            return {

            };
        },*/
        list: function() {
            return $http.get(config.apiURL + "/vehicles");
        },
        /*create: function(token, data) {
            return $http.get(config.apiURL + "/vehicles", {
                headers: { 'token': token },
                body: data
            });
        },*/
        get: function(vehicle_id) {
            return $http.get(config.apiURL + "/vehicles/" + vehicle_id);
        }/*,
        edit: function(token, vehicle_id, data) {
            return $http.get(config.apiURL + "/vehicles/" + vehicle_id, {
                headers: { 'token': token },
                body: data
            });
        },
        delete: function(token, vehicle_id) {
            return $http.get(config.apiURL + "/vehicles/" + vehicle_id, {
                headers: { 'token': token }
            });
        },
        deleteAll: function(token) {
            return $http.get(config.apiURL + "/vehicles", {
                headers: { 'token': token }
            });
        }*/
    };

});
