var app = angular.module("gwot-vst");

/**
 * Footer Controller
 */
app.controller("FooterController", function($scope, $rootScope, config, $translate) {

    /**
     * Check if user is logged in
     */
    $scope.load = function() {
        if ($rootScope.authenticated_user) {
            $scope.language = 'en_US';
            // TODO: $scope.language = $rootScope.authenticated_user.language;
            $translate.use($scope.language);
        } else {
            $scope.language = config.appLanguage;
        }
        $translate.use($scope.language);
    };

    /**
     * Initialize
     */
    $scope.config = config;
    $scope.load();
    /**
     *update language if user logs in
     */
    $rootScope.$on('update', function() {
        $scope.load();
    });
    /**
     * Change Language
     */
    $scope.changeLanguage = function() {
        $translate.use($scope.language);
    };

});
