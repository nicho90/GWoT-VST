var app = angular.module("gwot-vst");


// Home Controller
//app.controller("HomeController", function($socket, $scope, $translate) {
app.controller("HomeController", function($scope, $translate, $socket) {

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

  /*
   * Activate socket for thresholds
   */
  $socket.emit('/thresholds/activate', {
      status: true
  });

  /*
   * Deactivate socket for thresholds
   */
  /*
  $socket.emit('/thresholds/activate', {
      status: false
  });
  */

  /*
   * Activate socket for realtime data
   */
  $socket.emit('/thresholds/activate', {
      status: true
  });

  /*
   * Dectivate socket for realtime data
   */
  /*
  $socket.emit('/thresholds/activate', {
      status: false
  });
  */

  /*
   * Receiving notifications when specific thresholds are reached
   */
  $socket.on('/notification/threshold', function(data) {
      console.log("Threshold notification received");
  });

  /*
   * Receiving realtime data
   */
  $socket.on('/notification/threshold', function(data) {
      console.log("Threshold notification received");
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
