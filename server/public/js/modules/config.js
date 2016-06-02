var app = angular.module("config", []);

/**
 * Constants
 */
app.constant("config", {
    appName: "GWoT-VST",
    appDevelopers: [
        {
            name: "Nicholas Schiestel"
        }, {
            name: "Heinrich Löwen"
        }, {
            name: "Rehen Aziz Chaudhary"
        }, {
            name: "Timm Kühnel"
        }
    ],
    appGithub: "https://github.com/nicho90/GWoT-VST",
    appVersion: "v1.0",
    appLanguage: 'en_US',
    //apiURL: "/api"
    apiURL: "http://giv-gwot-vst.uni-muenster.de:3333/api",
    mapboxAccessToken: "pk.eyJ1IjoibmljaG85MCIsImEiOiJjaW8xam9jem4wMHZudnZseWdhcjBydXEyIn0.azXlfQRmQ-GKhmQcN8MzlQ",
    timeZone: "+0100"
});
