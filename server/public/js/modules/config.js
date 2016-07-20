var app = angular.module("config", []);

/**
 * Constants
 */
app.constant("config", {
    appName: "GSys",
    appDevelopers: [
        {
            name: "Nicholas Schiestel",
            github: "nicho90"
        }, {
            name: "Heinrich Löwen",
            github: "heinrichloewen"
        }, {
            name: "Rehen Aziz Chaudhary",
            github: "rehans516"
        }, {
            name: "Timm Kühnel",
            github: "timmimim"
        }
    ],
    appGithub: "https://github.com/nicho90/GWoT-VST",
    appVersion: "v1.0",
    appLanguage: 'en_US',
    apiURL: "/api",
    //apiURL: "http://giv-gwot-vst.uni-muenster.de/api",
    mapboxAccessToken: "pk.eyJ1IjoibmljaG85MCIsImEiOiJjaW8xam9jem4wMHZudnZseWdhcjBydXEyIn0.azXlfQRmQ-GKhmQcN8MzlQ",
    timeZone: "+0100"
});
