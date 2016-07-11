var app = angular.module("waterBodyService", []);

/**
 * Water Body Service Provider
 */
app.factory('$waterBodyService', function($http, config) {

    return {

        list: function() {
            return $http.get(config.apiURL + "/water_bodies");
        },
        get: function(water_body_id) {
            return $http.get(config.apiURL + "/water_bodies/" + water_body_id);
        }

    };

});
