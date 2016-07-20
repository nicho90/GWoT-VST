var app = angular.module("gwot-vst");


// EDIT
app.controller("SensorEditController", function($scope, $rootScope, $routeParams, $location, $translate, $filter, $sensorService, $waterBodyService, $verificationService, config) {

    /**
     * Load function
     */
    $scope.load = function(){

        // Check if User is authenticated
        if (!$rootScope.authenticated_user) {
            $location.url("/");
        } else {

            // Load Sensor
            $sensorService.user_get($rootScope.authenticated_user.token, $rootScope.authenticated_user.username, $routeParams.sensor_id).success(function(response){
                $scope.sensor = response;
                $scope._device_id = $scope.sensor.device_id;

                // Add marker to map
                $scope.markers.push({
                    layer: 'sensor',
                    lat: $scope.sensor.lat,
                    lng: $scope.sensor.lng,
                    focus: true,
                    draggable: true,
                    icon: $scope.defaultIcon,
                    message: '<center>{{ \'SENSOR\' | translate }}</center>',
                    getMessageScope: function() {
                        return $scope;
                    },
                    compileMessage: true,
                    popupOptions: {
                        closeButton: true
                    },
                    enable: [
                        'leafletDirectiveMarker.map.click',
                        'leafletDirectiveMarker.map.dblclick'
                    ]
                });

            }).error(function(err) {
                $scope.err = err;
            });


            // Load Water Bodies
            $waterBodyService.list().success(function(response){
                $scope.water_bodies = response;
            }).error(function(err) {
                $scope.err = err;
            });

        }
    };


    /**
     * Save
     */
    $scope.save = function(){


        $sensorService.user_put($rootScope.authenticated_user.token, $rootScope.authenticated_user.username, $scope.sensor.sensor_id, $scope.sensor).success(function(response){

            // Reset
            delete $scope.sensor;

            // Redirect
            $location.url("/users/" + $rootScope.authenticated_user.username + "/tab/" + 4);
        }).error(function(err) {
            $scope.err = err;
        });

    };


    /**
     * Map
     */
    angular.extend($scope, {
        center: {
            lng: 0.0,
            lat: 0.0,
            zoom: 1
        },
        defaults: {
            scrollWheelZoom: true
        },
        layers: {
            baselayers: {
                mapbox_streets: {
                    name: $filter('translate')('MAP_TILES_STREETS'),
                    url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}{format}?access_token={apikey}',
                    type: 'xyz',
                    layerOptions: {
                        apikey: config.mapboxAccessToken,
                        mapid: 'mapbox.streets',
                        format: '@2x.png'
                    }
                },
                mapbox_satellite: {
                    name: $filter('translate')('MAP_TILES_SATELLITE'),
                    url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}{format}?access_token={apikey}',
                    type: 'xyz',
                    layerOptions: {
                        apikey: config.mapboxAccessToken,
                        mapid: 'mapbox.satellite',
                        format: '@2x.png'
                    }
                },
                mapbox_satellite_streets: {
                    name: $filter('translate')('MAP_TILES_SATELLITE_2'),
                    url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}{format}?access_token={apikey}',
                    type: 'xyz',
                    layerOptions: {
                        apikey: config.mapboxAccessToken,
                        mapid: 'mapbox.streets-satellite',
                        format: '@2x.png'
                    }
                },
                mapbox_night: {
                    name: $filter('translate')('MAP_TILES_DARK'),
                    url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}{format}?access_token={apikey}',
                    type: 'xyz',
                    layerOptions: {
                        apikey: config.mapboxAccessToken,
                        mapid: 'mapbox.dark',
                        format: '@2x.png'
                    }
                },
                mapbox_light: {
                    name: $filter('translate')('MAP_TILES_LIGHT'),
                    url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}{format}?access_token={apikey}',
                    type: 'xyz',
                    layerOptions: {
                        apikey: config.mapboxAccessToken,
                        mapid: 'mapbox.light',
                        format: '@2x.png'
                    }
                }
            },
            overlays: {
                sensor: {
                    name: $filter('translate')('SENSOR'),
                    type: "group",
                    visible: true
                }
            }
        },
        markers: [],
        defaultIcon: {
            type: 'awesomeMarker',
            markerColor: 'gray',
            prefix: 'fa',
            icon: 'cube'
        },
        events: {
            map: {
                enable: [
                    'leafletDirectiveMap.click',
                    'leafletDirectiveMap.dblclick'
                ],
                logic: 'emit'
            },
            markers: {
                enable: [
                    'dragend'
                ],
                logic: 'emit'
            }
        }
    });



    /**
     * Center marker when clicked
     * (Map function)
     */
    $scope.$on("leafletDirectiveMarker.map_3.click", function(event, args) {
        $scope.center = {
            lat: args.leafletEvent.latlng.lat,
            lng: args.leafletEvent.latlng.lng,
            zoom: $scope.center.zoom
        };
    });


    /**
     * Zoom to and center marker when double clicked
     * (Map function)
     */
    $scope.$on("leafletDirectiveMarker.map_2.dblclick", function(event, args) {
        $scope.center = {
            lat: args.leafletEvent.latlng.lat,
            lng: args.leafletEvent.latlng.lng,
            zoom: 18
        };
    });


    /**
     * Update Longitude and Latitude when marker was dragged
     * (Marker function)
     */
    $scope.$on("leafletDirectiveMarker.map_2.dragend", function(event, args){
        $scope.sensor.lat = Math.floor(args.leafletEvent.target._latlng.lat * 1000000) / 1000000;
        $scope.sensor.lng = Math.floor(args.leafletEvent.target._latlng.lng * 1000000) / 1000000;
        $scope.center = {
                lat: $scope.sensor.lat,
                lng: $scope.sensor.lng,
                zoom: $scope.center.zoom
        };
    });



    /**
     * Check Device-Id
     */
    $scope.checkDeviceId = function(device_id){
        if(device_id === $scope.device_id){
            $scope.device_id_available = "undefined";
        } else if(device_id === $scope._device_id){
            $scope.device_id_available = true;
        } else {
            $verificationService.verify_device_id(device_id).success(function(response){
                $scope.device_id_available = response;
            }).error(function(err) {
                $scope.err = err;
            });
        }
    };


    /**
     * Cancel
     */
    $scope.cancel = function(){
        delete $scope.sensor;

        // Redirect to
        $location.url("/users/" + $rootScope.authenticated_user.username + "/tab/" + 4);
    };


    /**
     * Init
     */
    $scope.load();
    $scope.search = "";
    $scope.device_id_available = true;
});
