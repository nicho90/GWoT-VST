var app = angular.module("userService", []);

/**
 * User Service Provider
 */
app.factory('$userService', function($http, config) {

    return {
        getDefault: function() {
            return {
                username : "",
                password : "",
                first_name : "",
                last_name : "",
                language : "en_US"
            };
        },
        create: function(data){
            return $http.post(config.apiURL + "/users", data);
        },
        get: function(token, username){
            return $http.get(config.apiURL + "/users/" + username, {
                headers: { 'authorization': token }
            });
        },
        edit: function(token, username, data){
            return $http.put(config.apiURL + "/users/" + username, {
                headers: { 'authorization': token },
                body: data
            });
        },
        delete: function(token, username){
            return $http.delete(config.apiURL + "/users/" + username, {
                headers: { 'authorization': token }
            });
        }
    };

});
