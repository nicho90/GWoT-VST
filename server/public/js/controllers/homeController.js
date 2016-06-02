var app = angular.module("gwot-vst");


/**
 * Home and Map Controller
 */
app.controller("HomeController", function($scope, $rootScope, config, $filter, $translate, $sensorService, $measurementService) {

    /**
     * Load Sensors
     */
    $scope.load = function() {

        if($rootScope.authenticated_user) {

            // Request public sensors and private sensors of the authenticated user
            $sensorService.list_private($rootScope.authenticated_user.token, $rootScope.authenticated_user.username, "?public=true").success(function(response) {
                $scope.sensors = response;
                $scope.markers = [];
                $scope.updateMarker();
            }).error(function(err) {
                $scope.err = err;
            });
        } else {

            // Request only public sensors
            $sensorService.list_public().success(function(response) {
                $scope.sensors = response;
                $scope.markers = [];
                $scope.updateMarker();
            }).error(function(err) {
                $scope.err = err;
            });
        }

    };


    /**
     * Init
     */
    $scope.load();


    /**
     * Update when user logged in or out
     */
    $rootScope.$on('update', function(){
        $scope.load();
    });


    /**
     *
     */
    $scope.updateMarker = function(){

        // TODO: Check Threshold

        angular.forEach($scope.sensors, function(sensor, key){

            $measurementService.get(sensor.sensor_id, "?latest=true")
            .success(function(response){
                $scope.sensors[key].latest_measurement = response;

                var _message = '<h6>' + sensor.description + '</h6>' +
                    '<table class="table-sm"><tbody>' +
                        '<tr>' +
                            '<th>' + 'DeviceId' + '</th>' +
                            '<td><kbd>' + sensor.device_id + '</kbd></td>' +
                        '</tr>' +
                        '<tr>' +
                            '<th>' + 'Online' + '</th>' +
                            '<td>' + sensor.online_status + '</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<th>' + 'Water Level' + '</th>' +
                            '<td>' + (sensor.latest_measurement.water_level/100).toFixed(3) + ' m</td>' +
                        '</tr>' +
                    '</tbody></table><br>' +
                    '<center>' +
                        '<button type="button" class="form-control btn btn-primary btn-sm">Details</button>'+
                    '</center>';

                $scope.markers.push(
                    {
                        layer: 'sensors',
                        lat: sensor.lat,
                        lng: sensor.lng,
                        focus: false,
                        draggable: false,
                        icon: $scope.successIcon,
                        message : _message,
                        //getMessageScope: $scope,
                        //compileMessage: true,
                        compileMessage: false,
                        popupOptions : {
                            closeButton : true
                        },
                        enable: ['leafletDirectiveMarker.map.click', 'leafletDirectiveMarker.map.dblclick']
                    }
                );
            })
            .error(function(err) {
                $scope.err = err;
            });

        });
    };


    /**
     * Map
     */
    angular.extend($scope, {
        center: {
            lng: 7.70013, // TODO: More generic
            lat: 51.973314, // TODO: More generic
            zoom: 14 // TODO: More generic
        },
        defaults: {
            scrollWheelZoom: true
        },
        layers: {
            baselayers: {
                mapbox_streets: {
                    name: $translate.instant('MAP_TILES_STREETS'),
                    url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}{format}?access_token={apikey}',
                    type: 'xyz',
                    layerOptions: {
                        apikey: config.mapboxAccessToken,
                        mapid: 'mapbox.streets',
                        format: '@2x.png'
                    }
                },
                mapbox_satellite: {
                    name: $translate.instant('MAP_TILES_SATELLITE'),
                    url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}{format}?access_token={apikey}',
                    type: 'xyz',
                    layerOptions: {
                        apikey: config.mapboxAccessToken,
                        mapid: 'mapbox.satellite',
                        format: '@2x.png'
                    }
                },
                mapbox_satellite_streets: {
                    name: $translate.instant('MAP_TILES_SATELLITE_2'),
                    url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}{format}?access_token={apikey}',
                    type: 'xyz',
                    layerOptions: {
                        apikey: config.mapboxAccessToken,
                        mapid: 'mapbox.streets-satellite',
                        format: '@2x.png'
                    }
                },
                mapbox_night: {
                    name: $translate.instant('MAP_TILES_DARK'),
                    url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}{format}?access_token={apikey}',
                    type: 'xyz',
                    layerOptions: {
                        apikey: config.mapboxAccessToken,
                        mapid: 'mapbox.dark',
                        format: '@2x.png'
                    }
                },
                mapbox_light: {
                    name: $translate.instant('MAP_TILES_LIGHT'),
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
                sensors: {
                    name: $filter('translate')('SENSORS'),
                    type: "group",
                    visible: true
                }
            }
        },
        markers: [],
        successIcon: {
            type: 'awesomeMarker',
            markerColor: 'green',
            prefix : 'fa',
            icon : 'cube'
        },
        warningIcon: {
            type: 'awesomeMarker',
            markerColor: 'orange',
            prefix : 'fa',
            icon : 'cube'
        },
        dangerIcon: {
            type: 'awesomeMarker',
            markerColor: 'red',
            prefix : 'fa',
            icon : 'cube'
        },
        offlineIcon: {
            type: 'awesomeMarker',
            markerColor: 'lightgrey',
            prefix : 'fa',
            icon : 'cube'
        },
        events: {
            map: {
                enable: ['leafletDirectiveMap.click', 'leafletDirectiveMap.dblclick'],
                logic: 'emit'
            }
        }
    });


    /**
     * Center marker when clicked
     * (Map function)
     */
    $scope.$on("leafletDirectiveMarker.map.click", function(event, args){
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
    $scope.$on("leafletDirectiveMarker.map.dblclick", function(event, args){
        $scope.center = {
            lat: args.leafletEvent.latlng.lat,
            lng: args.leafletEvent.latlng.lng,
            zoom: 18
        };
    });
});
