/**
 * Created by timmimim on 13/05/16.
 */

var app = angular.module("config", []);

/**
 * Constants
 * @param   {[type]}    "setup"     [description]
 */
app.constant("config", {
    appName: "GWoT-VST",
    appDevelopers: ["Nicholas Schiestel", "Heinrich Löwen", "Rehen Aziz Chaudhary", "Timm Kühnel"],
    appGithub: "https://github.com/nicho90/GWoT-VST",
    appVersion: "v1.0",
    appLanguage: 'en_US',
    //apiURL: "/api"
    apiURL: "http://giv-gwot-vst.uni-muenster.de:3333/api",
    timeZone: "+0100"
});