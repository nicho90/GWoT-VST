var app = angular.module("gwot-vst", [

        // External Modules
        //"ngRoute",
        "pascalprecht.translate",
        "btford.socket-io",

        // Own Modules
        //"routes"
        "languages"

    ]
);


/**
 * Sockets
 */
app.factory('$socket', function (socketFactory) {
  console.log(socketFactory);
  return socketFactory();
});


// Start App
app.run(function($translate) {

    // Use Translator and set
    $translate.use('en_US');

});
