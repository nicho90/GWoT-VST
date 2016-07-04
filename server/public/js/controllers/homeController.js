var app = angular.module("gwot-vst");


/**
 * Home and Map Controller
 */
app.controller("HomeController", function($scope, $rootScope, $routeParams, config, $filter, $location, $translate, $sensorService, $measurementService) {

    /**
     * Load Sensors
     */
    $scope.load = function() {

        // Check if User is authenticated
        var token;
        if ($rootScope.authenticated_user) {
            token = $rootScope.authenticated_user.token;
        } else {
            token = "";
        }

        // Request only public sensors (or also private sensors of an user, if the user is authenticated)
        $sensorService.list(token).success(function(response) {
            $scope.sensors = response;
            $scope.markers = [];
            $scope.updateMarker();
        }).error(function(err) {
            $scope.err = err;
        });

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

        // Check if User is authenticated
        var token;
        if ($rootScope.authenticated_user) {
            token = $rootScope.authenticated_user.token;
        } else {
            token = "";
        }

        angular.forEach($scope.sensors, function(sensor, key) {

            // Prepare focus
            var _focus = false;

            // Check if routeParams were set
            if($routeParams.sensor_id !== undefined && Number($routeParams.sensor_id) === sensor.sensor_id){
                _focus = true;
            }

            // Request lastest measurement for sensor
            $measurementService.get_latest(token, sensor.sensor_id)
                .success(function(response) {
                    $scope.sensors[key].latest_measurement = response;

                    // Prepare Icon
                    var _icon = $scope.defaultIcon;

                    // Check if User is authenticated
                    if($rootScope.authenticated_user !== undefined){

                        // Check if User has set a current Threshold
                        if($rootScope.authenticated_user.currentThreshold.threshold_id !== 0) {

                            // Check if water_level exists
                            if($scope.sensors[key].latest_measurement.water_level !== undefined){
                                if($scope.sensors[key].latest_measurement.water_level >= $scope.sensors[key].water_level + $rootScope.authenticated_user.currentThreshold.warning_threshold && $scope.sensors[key].latest_measurement.water_level < $scope.sensors[key].crossing_height + $rootScope.authenticated_user.currentThreshold.critical_threshold){
                                    _icon = $scope.warningIcon;
                                } else if($scope.sensors[key].latest_measurement.water_level >= $scope.sensors[key].crossing_height + $rootScope.authenticated_user.currentThreshold.critical_threshold) {
                                    _icon = $scope.dangerIcon;
                                } else {
                                    _icon = $scope.successIcon;
                                }
                            }
                        }
                    }

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
                        focus: _focus,
                        draggable: false,
                        icon: _icon,
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
        defaultIcon: {
            type: 'awesomeMarker',
            markerColor: 'gray',
            prefix: 'fa',
            icon: 'cube'
        },
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
        legend: {
            position: 'bottomleft',
            colors: [
                '#70B211',
                '#F8981B',
                '#D83D20',
                '#575757'
            ],
            labels: [
                $translate.instant('PASSABLE'),
                $translate.instant('RISK'),
                $translate.instant('HIGH_RISK'),
                $translate.instant('N_A')
            ]
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
