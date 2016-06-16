var app = angular.module("gwot-vst");


// Home Controller
app.controller("HomeController", function($socket, $scope, $translate) {

  /**
   * Sockets testing
   */
  $socket.on('test', function(data) {
      console.log("Socket received. Data:", data);
      //TODO
  });

  $socket.emit('test', {
      //TODO
      test: "data"
  });


  // Standard Query
  $scope.query = {
      value: 3,
      time: "months"
  };

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
