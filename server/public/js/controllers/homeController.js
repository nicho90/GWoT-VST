var app = angular.module("gwot-vst");


/**
 * Home and Map Controller
 */
app.controller("HomeController", function($scope, $rootScope, config, $filter, $location, $translate, $sensorService, $measurementService) {

    /**
     * Load Sensors
     */
    $scope.load = function() {

        if ($rootScope.authenticated_user) {

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
    $rootScope.$on('update', function() {
        $scope.load();
    });


    /**
     * Show Details
     */
    $scope.showDetails = function(sensor_id) {
        $location.url("/sensors/" + sensor_id);
    };


    /**
     *
     */
    $scope.updateMarker = function() {

        // TODO: Check Threshold


        angular.forEach($scope.sensors, function(sensor, key) {

            // Request lastest measurement for sensor
            $measurementService.get(sensor.sensor_id, "?latest=true")
                .success(function(response) {
                    $scope.sensors[key].latest_measurement = response;

                    // Check if latest measurement exists
                    var water_level = "-";
                    if (sensor.latest_measurement.water_level !== undefined) {
                        water_level = (sensor.latest_measurement.water_level / 100).toFixed(3) + " m";
                    }

                    // Check online-status of sensor
                    var online_status = '<span class="text-danger online_status_point"><i class="fa fa-circle" aria-hidden="true"></i></span>';
                    if (sensor.online_status) {
                        online_status = '<span class="text-success online_status_point"><i class="fa fa-circle" aria-hidden="true"></i></span>';
                    }

                    // Create Popup-Message
                    var _message = online_status + '<h6>' + sensor.description + '</h6>' +
                        '<table class="table-sm"><tbody>' +
                        '<tr>' +
                        '<th>' + '{{ \'DEVICE_ID\' | translate }}' + '</th>' +
                        '<td><kbd>' + sensor.device_id + '</kbd></td>' +
                        '</tr>' +
                        '<tr>' +
                        '<th>' + '{{ \'WATER_LEVEL\' | translate }}' + '</th>' +
                        '<td>' + water_level + '</td>' +
                        '</tr>' +
                        '</tbody></table><br>' +
                        '<center>' +
                        '<button ng-click="showDetails(' + sensor.sensor_id + ')" type="button" class="form-control btn btn-primary btn-sm">{{ \'DETAILS\' | translate }}</a>' +
                        '</center>';

                    $scope.markers.push({
                        layer: 'sensors',
                        lat: sensor.lat,
                        lng: sensor.lng,
                        focus: false,
                        draggable: false,
                        icon: $scope.successIcon,
                        message: _message,
                        getMessageScope: function() {
                            return $scope;
                        },
                        compileMessage: true,
                        popupOptions: {
                            closeButton: true
                        },
                        enable: ['leafletDirectiveMarker.map.click', 'leafletDirectiveMarker.map.dblclick']
                    });
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
            prefix: 'fa',
            icon: 'cube'
        },
        warningIcon: {
            type: 'awesomeMarker',
            markerColor: 'orange',
            prefix: 'fa',
            icon: 'cube'
        },
        dangerIcon: {
            type: 'awesomeMarker',
            markerColor: 'red',
            prefix: 'fa',
            icon: 'cube'
        },
        offlineIcon: {
            type: 'awesomeMarker',
            markerColor: 'lightgrey',
            prefix: 'fa',
            icon: 'cube'
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
    $scope.$on("leafletDirectiveMarker.map.click", function(event, args) {
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
    $scope.$on("leafletDirectiveMarker.map.dblclick", function(event, args) {
        $scope.center = {
            lat: args.leafletEvent.latlng.lat,
            lng: args.leafletEvent.latlng.lng,
            zoom: 18
        };
    });
});
