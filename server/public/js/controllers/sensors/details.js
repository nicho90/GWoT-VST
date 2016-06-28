var app = angular.module("gwot-vst");


// DETAILS
app.controller("SensorDetailsController", function($scope, $rootScope, $routeParams, $location, $translate, $filter, $sensorService, $statisticService, $forecastService, $timeseriesService, config, $socket) {


    /**
     * Change the time query more specific by a number to update the timeseries chart
     * @param  {string} time  [minutes, hours, days, weeks, months, years]
     * @param  {number} value [number]
     */
    $scope.changeQuery = function(time, value) {

        $scope.query.time = time;
        $scope.query.value = value;

        // Refresh Timeseries
        $scope.update_timeseries();
    };

    /**
     * Change the time query by an option update the timeseries chart
     * @param  {string} option [hours, days, weeks, months, years or all]
     */
    $scope.changeOption = function(option) {

        if (option === "hours") {
            $scope.timeoption = "hours";
            $scope.query.time = "minutes";
            $scope.query.value = 30;
        } else if (option === "days") {
            $scope.timeoption = "days";
            $scope.query.time = "days";
            $scope.query.value = 1;
        } else if (option === "weeks") {
            $scope.timeoption = "weeks";
            $scope.query.time = "weeks";
            $scope.query.value = 1;
        } else if (option === "months") {
            $scope.timeoption = "months";
            $scope.query.time = "months";
            $scope.query.value = 1;
        } else if (option === "years") {
            $scope.timeoption = "years";
            $scope.query.time = "years";
            $scope.query.value = 1;
        } else if (option === "all") {
            $scope.timeoption = "all";
            $scope.query.time = "";
            $scope.query.value = "";
        }

        // Refresh Timeseries
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

        // Reset Dataset
        $scope.data.dataset = [];

        // Check if query was defined
        var query;
        if ($scope.query.time !== "" && $scope.query.value !== "") {
            query = "?" + $scope.query.time + "=" + $scope.query.value;
        } else {
            query = "";
        }

        // Check if User is authenticated
        var token;
        if ($rootScope.authenticated_user) {
            token = $rootScope.authenticated_user.token;
        } else {
            token = "";
        }

        // Request timeseries
        $timeseriesService.list(token, $scope.sensor.sensor_id, query)
            .success(function(response) {
                $scope.sensor.timeseries = response;

                // Add values to chart
                angular.forEach($scope.sensor.timeseries, function(timeserie, key) {

                    // Draw dots
                    $scope.data.dataset.push({
                        timestamp: new Date(timeserie.measurement_date), // TODO: only data, no time!
                        water_level: timeserie.water_level,
                        sensor_height: $scope.sensor.sensor_height,
                        crossing_height: $scope.sensor.crossing_height,
                        gauge_zero: 0,
                        sensor_threshold_value: $scope.sensor.threshold_value,
                        warning_threshold: $scope.sensor.crossing_height + $scope.currentThreshold.warning_threshold,
                        critical_threshold: $scope.sensor.crossing_height + $scope.currentThreshold.critical_threshold
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

        // Create Gauge-Zero-Serie
        $scope.options.series.push({
            visible: true,
            axis: "y",
            dataset: "dataset",
            key: "gauge_zero",
            label: "Gauge Zero", // TODO: translate
            color: "rgba(0, 0, 0, 1)", //color: "hsla(88, 48%, 48%, 1)",
            type: [
                "line",
                "dot"
            ],
            id: "gaugeZero"
        });

        // Create Sensor-Height-Serie
        $scope.options.series.push({
            visible: false,
            axis: "y",
            dataset: "dataset",
            key: "sensor_height",
            label: "Sensor-Height", // TODO: translate
            color: "rgba(0, 204, 204, 1)",
            type: [
                "line",
                "dot"
            ],
            id: "sensorHeight"
        });

        // Create Sensor-Threshold-Height-Serie
        $scope.options.series.push({
            visible: false,
            axis: "y",
            dataset: "dataset",
            key: "sensor_threshold_value",
            label: "Sensor-Threshold-Height", // TODO: translate
            color: "rgba(205, 205, 0, 1)",
            type: [
                "line",
                "dot"
            ],
            id: "sensorThresholdHeight"
        });

        // Create Crossing-Height-Serie
        $scope.options.series.push({
            visible: true,
            axis: "y",
            dataset: "dataset",
            key: "crossing_height",
            label: "Crossing-Height", // TODO: translate
            color: "rgba(102, 0, 102, 1)",
            type: [
                "line",
                "dot"
            ],
            id: "crossingHeight"
        });

        // Create Warning-Threshold-Serie
        $scope.options.series.push({
            visible: false,
            axis: "y",
            dataset: "dataset",
            key: "warning_threshold",
            label: "Warning Threshold", // TODO: translate
            color: "rgba(255, 128, 0, 1)",
            type: [
                "line",
                "dot"
            ],
            id: "warningThreshold"
        });

        // Create Critical-Threshold-Serie
        $scope.options.series.push({
            visible: false,
            axis: "y",
            dataset: "dataset",
            key: "critical_threshold",
            label: "Critical Threshold", // TODO: translate
            color: "rgba(255, 0, 0, 1)",
            type: [
                "line",
                "dot"
            ],
            id: "criticalThreshold"
        });

        // Create Timeseries-Serie
        $scope.options.series.push({
            visible: true,
            axis: "y",
            dataset: "dataset",
            key: "water_level",
            label: $scope.sensor.device_id,
            color: "rgba(2, 117, 216, 1)", //color: "hsla(88, 48%, 48%, 1)",
            type: [
                "line",
                "dot",
                "area"
            ],
            id: "mainWaterLevels"
            /*interpolation: { // round curves
                mode: 'cardinal', tension: 0.7
            }*/
        });

        $scope.update_timeseries();
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


    /**
     * Load related data
     */
    $scope.load_related_data = function() {

        // Check if User is authenticated
        var token = "";
        if ($rootScope.authenticated_user) {
            token = $rootScope.authenticated_user.token;
        }

        // Request Statistics
        $statisticService.get(token, $routeParams.sensor_id)
            .success(function(response) {
                $scope.sensor.statistics = response;
            }).error(function(err) {
                $scope.err = err;
            });


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
                    icon: $scope.relatedSensorIcon,
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
        $scope.realtime = false;

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
        if (tab == 3) {
            // Sockets: Activate realtime data
            $socket.emit('/data/realtime', {
                device_id: $scope.sensor.device_id,
                status: true,
            });
            $scope.realtime = true;
        } else if ($scope.realtime) {
            // Sockets: Deactivate realtime data
            $socket.emit('/data/realtime', {
                device_id: $scope.sensor.device_id,
                status: false,
            });
            $scope.realtime = false;
        }
    };

    /*
     * Sockets: Receiving realtime data
     */
    $socket.on('/data/realtime', function(data) {
        console.log("Realtime data received");
        //TODO write realtime data to chart
    });


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
        relatedSensorIcon: {
            type: 'awesomeMarker',
            markerColor: 'darkgreen',
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


    /**
     * Show Details
     * @param  {number} sensor_id [The Id of a Sensor]
     */
    $scope.showDetails = function(sensor_id){
        $location.url("/sensors/" + sensor_id);
    };


    /**
     * Init
     */
    $scope.load();

    // Select General-tab (Overview of the Sensor)
    $scope.tab = 1;

    // Prepare Timeoption and Timequery for Linechart
    $scope.timeoption = "hours";
    $scope.query = {
        time: "minutes",
        value: 30
    };

    // Prepare Datasets for Linechart
    $scope.data = {
        dataset: []
    };

    // TODO: Support for current Threshold
    $scope.currentThreshold = {
        warning_threshold: 10,
        critical_threshold: 20,
    };
});
