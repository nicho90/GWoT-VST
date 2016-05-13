var app = angular.module("gwot-vst", [


    // App Settings
    "config",

    // External Modules
    "ngRoute",
    "pascalprecht.translate",

    // Own Modules
    "routes",
    "languages",

    //Services
    "sensorService"
]);


// Start App
app.run(function($translate, config) {

    // Use Translator and set Language
    $translate.use(config.appLanguage);

});
