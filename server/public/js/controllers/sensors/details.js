var app = angular.module("gwot-vst");


// LIST
app.controller("SensorDetailsController", function($sce, $scope, $rootScope, $routeParams, $location, $translate, $filter, $sensorService, $forecastService, config) {


    /**
     * Load Forecast.io Weather
     */
    $scope.load_forecast = function(){

        // Check language
        var language;
        if($translate.use() === 'en_US'){
            language = 'en';
        } else if ($translate.use() === 'de_DE'){
            language = 'de';
        } else {
            language = 'en';
        }

        // Request Forecast.io Weather API
        $forecastService.get($scope.sensor.lat, $scope.sensor.lng, language)
        .success(function(response) {
            $scope.weather_forecast = response;
        }).error(function(err) {
            $scope.err = err;
        });
    };


    /**
     * Load Sensor
     */
    $scope.load_realted_data = function() {

        // Request related sensors
        $sensorService.get_related_stations($routeParams.sensor_id)
        .success(function(response) {
            $scope.sensor.related_sensors = response;
            $scope.updateMarkers('related_sensors');

        }).error(function(err) {
            $scope.err = err;
        });

        // Request nearby emergency stations
        $sensorService.get_emergency_stations($routeParams.sensor_id)
        .success(function(response) {
            $scope.sensor.emergency_stations = response;
            $scope.updateMarkers('emergency_stations');

        }).error(function(err) {
            $scope.err = err;
        });

        // Request nearby service stations
        $sensorService.get_service_stations($routeParams.sensor_id)
        .success(function(response) {
            $scope.sensor.service_stations = response;
            $scope.updateMarkers('service_stations');

        }).error(function(err) {
            $scope.err = err;
        });
    };


    /**
     * Update Marker
     */
    $scope.updateMarker = function(){
        $scope.markers.push(
            {
                layer: 'sensor',
                lat: $scope.sensor.lat,
                lng: $scope.sensor.lng,
                focus: true,
                draggable: false,
                icon: $scope.successIcon,
                message : $scope.sensor.description,
                //getMessageScope: $scope,
                //compileMessage: true,
                compileMessage: false,
                popupOptions : {
                    closeButton : true
                },
                enable: ['leafletDirectiveMarker.map.click', 'leafletDirectiveMarker.map.dblclick']
            }
        );
    };

    /**
     * Update Markers
     */
    $scope.updateMarkers = function(layer){

        if(layer === 'related_sensors'){

            angular.forEach($scope.sensor.related_sensors, function(related_sensor, key){
                $scope.markers.push(
                    {
                        layer: layer,
                        lat: related_sensor.lat,
                        lng: related_sensor.lng,
                        focus: false,
                        draggable: false,
                        icon: $scope.successIcon,
                        message : related_sensor.description,
                        //getMessageScope: $scope,
                        //compileMessage: true,
                        compileMessage: false,
                        popupOptions : {
                            closeButton : true
                        },
                        enable: ['leafletDirectiveMarker.map.click', 'leafletDirectiveMarker.map.dblclick']
                    }
                );
            });

        } else if(layer === 'emergency_stations'){

            angular.forEach($scope.sensor.emergency_stations, function(emergency_station, key){
                $scope.markers.push(
                    {
                        layer: layer,
                        lat: emergency_station.lat,
                        lng: emergency_station.lng,
                        focus: false,
                        draggable: false,
                        icon: $scope.emergencyStationIcon,
                        message : emergency_station.name,
                        //getMessageScope: $scope,
                        //compileMessage: true,
                        compileMessage: false,
                        popupOptions : {
                            closeButton : true
                        },
                        enable: ['leafletDirectiveMarker.map.click', 'leafletDirectiveMarker.map.dblclick']
                    }
                );
            });

        } else if(layer === 'service_stations'){

            angular.forEach($scope.sensor.service_stations, function(service_station, key){
                $scope.markers.push(
                    {
                        layer: layer,
                        lat: service_station.lat,
                        lng: service_station.lng,
                        focus: false,
                        draggable: false,
                        icon: $scope.serviceStationIcon,
                        message : service_station.name,
                        //getMessageScope: $scope,
                        //compileMessage: true,
                        compileMessage: false,
                        popupOptions : {
                            closeButton : true
                        },
                        enable: ['leafletDirectiveMarker.map.click', 'leafletDirectiveMarker.map.dblclick']
                    }
                );
            });

        }
    };


    /**
     * Load Sensor
     */
    $scope.load = function() {

        $scope.markers = [];

        // Check if user is authenticated
        if($rootScope.authenticated_user) {

            // Request private or public sensors of authenticated user
            $sensorService.get_private($rootScope.authenticated_user.token, $rootScope.authenticated_user.username, $routeParams.sensor_id)
            .success(function(response) {
                $scope.sensor = response;
                $scope.load_forecast();
                $scope.load_realted_data();
                $scope.updateMarker();
            })
            .error(function(err) {
                $scope.err = err;
            });
        } else {

            // Request only public sensor
            $sensorService.get_public($routeParams.sensor_id)
            .success(function(response) {
                $scope.sensor = response;
                $scope.load_forecast();
                $scope.load_realted_data();
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
    $scope.tab = 1;


    /**
     * Update when user logged in or out
     */
    $rootScope.$on('update', function(){
        $scope.load();
    });


    /**
     * Update when user logged in or out
     */
    $scope.changeTab = function(tab){
        $scope.tab = tab;
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
                sensor: {
                    name: $filter('translate')('SENSOR'),
                    type: "group",
                    visible: true
                },
                related_sensors: {
                    name: $filter('translate')('NEARBY_SENSORS'),
                    type: "group",
                    visible: true
                },
                emergency_stations: {
                    name: $filter('translate')('EMERGENCY_STATIONS'),
                    type: "group",
                    visible: true
                },
                service_stations: {
                    name: $filter('translate')('SERIVE_STATIONS'),
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
            markerColor: 'lightgray',
            prefix : 'fa',
            icon : 'cube'
        },
        serviceStationIcon: {
            type: 'awesomeMarker',
            markerColor: 'blue',
            prefix : 'fa',
            icon : 'wrench'
        },
        emergencyStationIcon: {
            type: 'awesomeMarker',
            markerColor: 'darkblue',
            prefix : 'fa',
            icon : 'ambulance'
        },
        events: {
            map: {
                enable: ['leafletDirectiveMap.click', 'leafletDirectiveMap.dblclick'],
                logic: 'emit'
            }
        }
    });
});
