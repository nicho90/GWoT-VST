var app = angular.module("gwot-vst", [

        // External Modules
        "ngRoute",
        "pascalprecht.translate",

        // Own Modules
        "routes",
        "languages"

    ]
);


// Start App
app.run(function($translate) {

    // Use Translator and set
    $translate.use('en_US');

});
