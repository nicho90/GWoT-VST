var app = angular.module("verificationService", []);

/**
 * Verification Service Provider
 */
app.factory('$verificationService', function($http, config) {

    return {

        verify_username: function(username) {
            return $http.get(config.apiURL + "/verifications/user?username=" + username);
        },
        verify_device_id: function(device_id) {
            return $http.get(config.apiURL + "/verifications/device?device_id=" + device_id);
        }

    };

});
