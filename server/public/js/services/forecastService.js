var app = angular.module("forecastService", []);

/**
 * Forecast Service Provider
 */
app.factory('$forecastService', function($http, config) {

    return {

        get: function(lat, lng, language) {
            var query = "lat=" + lat + "&lng=" + lng + "&lang=" + language;
            return $http.get(config.apiURL + "/forecast?" + query);
        }
        
    };

});
