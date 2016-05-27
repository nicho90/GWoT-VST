var app = angular.module("gwot-vst");


/**
 * Alert Controller
 */
app.controller("AlertController", function($scope, $rootScope, $translate, $timeout) {


    /**
     * Show Alert
     */
    $rootScope.$on('alert', function(){
        $scope.isAlert = true;
        $scope.alert = {
            status: $rootScope.alert.status,
            info: $rootScope.alert.info,
            message: $rootScope.alert.message
        };

        if($rootScope.alert.status === 1) {
            $timeout(function () {
                $scope.isAlert = false;
            }, 2000);
        }

    });


    /**
     * Close Alert
     */
    $scope.alertClose = function(){
        $scope.isAlert = false;
    };

});
