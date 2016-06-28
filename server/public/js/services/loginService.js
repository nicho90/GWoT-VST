var app = angular.module("loginService", []);

/**
 * Login Service Provider
 */
app.factory('$loginService', function($http, config) {

    return {

        authenticate: function(data) {
            return $http.post(config.apiURL + "/login", data);
        }
        
    };

});
