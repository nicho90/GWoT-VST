var app = angular.module("gwot-vst");


// Home Controller
app.controller("HomeController", function($scope, $translate) {

    $scope.status = true;

    // Change Language
    $scope.changeLanguage = function(newLanguage) {
        $translate.use(newLanguage);

        if($scope.status) {
            $scope.status = false;
        } else {
            $scope.status = true;
        }

    };

    var i = 0;

    $scope.cats = [];

    // new cat-object
    $scope.cat = {
        "name": ""
    };

    // add new cat to the list (cat-array)
    $scope.add = function(){
        i++;
        $scope.cats.push(
            {
                "id": i,
                "name": $scope.cat.name
            }
        );
    };


});
