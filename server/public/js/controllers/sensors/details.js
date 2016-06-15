var app = angular.module("gwot-vst");


// LIST
app.controller("SensorDetailsController", function($socket, $sce, $scope, $rootScope, $routeParams, $location, $translate, $filter, $sensorService, $forecastService, $timeseriesService, config) {


    /**
     * Sockets testing
     */
    $socket.on('test', function(data) {
        console.log("Socket received. Data:", data);
        //TODO
    });

    $socket.emit('test', {
        //TODO
        test: "data"
    });


    // Standard Query
    $scope.query = {
        value: 3,
        time: "months"
    };


    /**
     * Change Query for updating the timeseries chart
     */
    $scope.changeQuery = function(time) {
        if (time === '' ||  time === undefined) {

        } else if (time === "minutes") {
            $scope.query.time = "minutes";
        } else if (time === "hours") {
            $scope.query.time = "hours";
        } else if (time === "days") {
            $scope.query.time = "days";
        } else if (time === "weeks") {
            $scope.query.time = "weeks";
        } else if (time === "months") {
            $scope.query.time = "months";
        } else if (time === "years") {
            $scope.query.time = "years";
        } else {
            $scope.query.time = "";
        }

        $scope.update_timeseries();
    };



    /**
     * Load Forecast.io Weather
     */
    $scope.load_forecast = function() {

        // Check language
        var language;
        if ($translate.use() === 'en_US') {
            language = 'en';
        } else if ($translate.use() === 'de_DE') {
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
     * Update Timeseries
     */
    $scope.update_timeseries = function() {
        $scope.data.dataset = [];

        // Check if query was defined
        var query = "";
        if ($scope.query) {
            query = "?" + $scope.query.time + "=" + $scope.query.value;
        } else {
            query = "";
        }

        // Request timeseries
        $timeseriesService.get($scope.sensor.sensor_id, query)
        .success(function(response) {
            $scope.sensor.timeseries = response;

            // Add values to chart
            angular.forEach($scope.sensor.timeseries, function(timeserie, key) {
                $scope.data.dataset.push({
                    timestamp: new Date(timeserie.measurement_date), // TODO: only data, no time!
                    water_level: timeserie.water_level
                });
            });

        }).error(function(err) {
            $scope.err = err;
        });
    };


    /**
     * Load Timeseries for Sensor
     */
    $scope.load_timeseries = function() {

        // Create Serie
        $scope.options.series.push({
            axis: "y",
            dataset: "dataset",
            key: "distance", // TODO: water_level
            label: $scope.sensor.device_id,
            color: "rgba(2, 117, 216, 1)",
            //color: "hsla(88, 48%, 48%, 1)",
            type: [
                "line",
                "dot",
                "area"
            ],
            id: $scope.sensor.sensor_id,
            /*interpolation: { // round curves
                mode: 'cardinal', tension: 0.7
            },*/
        });

        // Check if query was defined
        var query = "";
        if ($scope.query) {
            query = "?" + $scope.query.time + "=" + $scope.query.value;
        } else {
            query = "";
        }

        // Request timeseries
        $timeseriesService.get($scope.sensor.sensor_id, query)
        .success(function(response) {
            $scope.sensor.timeseries = response;

            // Add values to chart
            angular.forEach($scope.sensor.timeseries, function(timeserie, key) {
                $scope.data.dataset.push({
                    timestamp: new Date(timeserie.measurement_date), // TODO: only data, no time!
                    distance: timeserie.distance // TODO: water_level
                });
            });

        }).error(function(err) {
            $scope.err = err;
        });
    };


    /**
     * Linechart
     */
    $scope.options = {
        margin: {
            top: 10,
            bottom: 20,
            right: 50,
            left: 50
        },
        series: [],
        axes: {
            x: {
                key: "timestamp",
                type: "date"
            },
            y: {
                label: "CENTIMETER",
                tickFormat: function(value) {
                    return value + " cm";
                }
            }
        }
    };

    $scope.data = {
        dataset: []
            /*{
                timestamp: new Date("2016-05-04"),
                water_level: 0 // TODO: water_level
            }, {
                timestamp: new Date("2016-05-05"),
                water_level: 0.993
            }, {
                timestamp: new Date("2016-05-06"),
                water_level: 1.947
            }*/
    };


    /**
     * Load related data
     */
    $scope.load_related_data = function() {

        // Check if User is authenticated
        var token = "";
        if ($rootScope.authenticated_user) {
            token = $rootScope.authenticated_user.token;
        }

        // Request Related (neaby) Sensors
        $sensorService.get_related_sensors(token, $routeParams.sensor_id)
        .success(function(response) {
            $scope.sensor.related_sensors = response;
            $scope.updateMarkers('related_sensors');
        }).error(function(err) {
            $scope.err = err;
            $scope.sensor.related_sensors = [];
            $scope.updateMarkers('related_sensors');
        });


        // Request nearby Emergency-Stations
        $sensorService.get_emergency_stations(token, $routeParams.sensor_id)
        .success(function(response) {
            $scope.sensor.emergency_stations = response;
            $scope.updateMarkers('emergency_stations');
        }).error(function(err) {
            $scope.err = err;
            $scope.sensor.emergency_stations = [];
            $scope.updateMarkers('emergency_stations');
        });

        // Request nearby Service-Stations
        $sensorService.get_service_stations(token, $routeParams.sensor_id)
        .success(function(response) {
            $scope.sensor.service_stations = response;
            $scope.updateMarkers('service_stations');
        }).error(function(err) {
            $scope.err = err;
            $scope.sensor.service_stations = [];
            $scope.updateMarkers('service_stations');
        });
    };


    /**
     * Update Marker
     */
    $scope.updateMarker = function() {
        $scope.markers.push({
            sensor_id: $scope.sensor.sensor_id,
            layer: 'sensor',
            lat: $scope.sensor.lat,
            lng: $scope.sensor.lng,
            focus: true,
            draggable: false,
            icon: $scope.successIcon,
            message: $scope.sensor.description,
            getMessageScope: function() {
                return $scope;
            },
            compileMessage: true,
            popupOptions: {
                closeButton: true
            },
            enable: ['leafletDirectiveMarker.map.click', 'leafletDirectiveMarker.map.dblclick']
        });
    };

    /**
     * Update Markers
     */
    $scope.updateMarkers = function(layer) {

        if (layer === 'related_sensors') {

            angular.forEach($scope.sensor.related_sensors, function(related_sensor, key) {
                $scope.markers.push({
                    sensor_id: related_sensor.sensor_id,
                    layer: layer,
                    lat: related_sensor.lat,
                    lng: related_sensor.lng,
                    focus: false,
                    draggable: false,
                    icon: $scope.successIcon,
                    message: related_sensor.description,
                    getMessageScope: function() {
                        return $scope;
                    },
                    compileMessage: true,
                    popupOptions: {
                        closeButton: true
                    },
                    enable: ['leafletDirectiveMarker.map.click', 'leafletDirectiveMarker.map.dblclick']
                });
            });

        } else if (layer === 'emergency_stations') {

            angular.forEach($scope.sensor.emergency_stations, function(emergency_station, key) {
                $scope.markers.push({
                    layer: layer,
                    lat: emergency_station.lat,
                    lng: emergency_station.lng,
                    focus: false,
                    draggable: false,
                    icon: $scope.emergencyStationIcon,
                    message: emergency_station.name,
                    getMessageScope: function() {
                        return $scope;
                    },
                    compileMessage: true,
                    popupOptions: {
                        closeButton: true
                    },
                    enable: ['leafletDirectiveMarker.map.click', 'leafletDirectiveMarker.map.dblclick']
                });
            });

        } else if (layer === 'service_stations') {

            angular.forEach($scope.sensor.service_stations, function(service_station, key) {
                $scope.markers.push({
                    layer: layer,
                    lat: service_station.lat,
                    lng: service_station.lng,
                    focus: false,
                    draggable: false,
                    icon: $scope.serviceStationIcon,
                    message: service_station.name,
                    getMessageScope: function() {
                        return $scope;
                    },
                    compileMessage: true,
                    popupOptions: {
                        closeButton: true
                    },
                    enable: ['leafletDirectiveMarker.map.click', 'leafletDirectiveMarker.map.dblclick']
                });
            });

        }
    };


    /**
     * Load Sensor
     */
    $scope.load = function() {

        $scope.markers = [];

        // Check if User is authenticated
        var token = "";
        if ($rootScope.authenticated_user) {
            token = $rootScope.authenticated_user.token;
        }

        // Request public sensor (or private sensor only when User is authenticated)
        $sensorService.get(token, $routeParams.sensor_id)
        .success(function(response) {
            $scope.sensor = response;
            $scope.load_forecast();
            $scope.load_timeseries();
            $scope.load_related_data();
            $scope.updateMarker();
        })
        .error(function(err) {
            $scope.err = err;
        });

    };


    /**
     * Init
     */
    $scope.load();
    $scope.tab = 1;


    /**
     * Update when user logged in or out
     */
    $rootScope.$on('update', function() {
        $scope.load();
    });


    /**
     * Update when user logged in or out
     */
    $scope.changeTab = function(tab) {
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
            markerColor: 'lightgray',
            prefix: 'fa',
            icon: 'cube'
        },
        serviceStationIcon: {
            type: 'awesomeMarker',
            markerColor: 'blue',
            prefix: 'fa',
            icon: 'wrench'
        },
        emergencyStationIcon: {
            type: 'awesomeMarker',
            markerColor: 'darkblue',
            prefix: 'fa',
            icon: 'ambulance'
        },
        events: {
            map: {
                enable: ['leafletDirectiveMap.click', 'leafletDirectiveMap.dblclick'],
                logic: 'emit'
            }
        }
    });
});
