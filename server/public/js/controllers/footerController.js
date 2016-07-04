var app = angular.module("gwot-vst");


/**
 * Footer Controller
 */
app.controller("FooterController", function($scope, $rootScope, config, $translate) {

    /**
     * Check if user is logged in
     */
    $scope.load = function() {
        if($rootScope.authenticated_user) {
            $scope.language = $rootScope.authenticated_user.language;
            $translate.use($scope.language);
        } else {
            $scope.language = config.appLanguage;
        }

        // Use language
        $translate.use($scope.language);
    };


    /**
     * Init
     */
    $scope.config = config;
    $scope.load();


    /**
     * Update language if user logs in
     */
    $rootScope.$on('update', function(){
        $scope.load();
    });


    /**
     * Change language
     */
    $scope.changeLanguage = function(){

        // Change language
        $translate.use($scope.language);

        // Update all Controllers
        $rootScope.$broadcast('updateLanguage');
    };

});
