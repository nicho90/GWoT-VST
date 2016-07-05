var app = angular.module("gwot-vst");


// DETAILS
app.controller("SensorDetailsController", function($scope, $rootScope, $routeParams, $location, $translate, $filter, $sensorService, $subscriptionService, $statisticService, $forecastService, $measurementService, $timeseriesService, config, $socket, _) {


    /**
     * Change the weather forecast
     * @param  {string} interval [Hourly or daily weather forecasts]
     */
    $scope.setWeatherInterval = function(interval){
        $scope.weather_interval = interval;
    };


    /**
     * Show Measurements (temperature and humidity values) in the weather forecast
     */
    $scope.showWeatherMeasurements = function(){
        if($scope.weather_measurements){
            $scope.weather_measurements = false;
        } else {
            $scope.weather_measurements = true;
        }
    };


    /**
     * Unsubscribe with current Threshold to current Sensor
     */
    $scope.unsubscribe = function(){

        var token;
        if ($rootScope.authenticated_user) {
            token = $rootScope.authenticated_user.token;

            // Check if current Subscription exists
            if($scope.currentSubscription){

                // Send request
                $subscriptionService.delete(token, $rootScope.authenticated_user.username, $scope.currentSubscription.subscription_id)
                .success(function(response) {

                    // Reset current Subscription
                    delete $scope.currentSubscription;
                    $scope.currentSubscription = undefined;
                    $scope.load_subscriptions();

                }).error(function(err) {
                    $scope.err = err;
                });
            }
        }
    };


    /**
     * Subscribe with current Threshold to current Sensor
     */
    $scope.subscribe = function(){

        // Check if User is authenticated
        var token;
        if ($rootScope.authenticated_user) {
            token = $rootScope.authenticated_user.token;

            // Check if User is authenticated
            if($rootScope.authenticated_user){
                if($rootScope.authenticated_user.currentThreshold !== undefined && $rootScope.authenticated_user.currentThreshold.threshold_id !== 0) {

                    // Find current Threshold in Subscriptions
                    var result = _.findWhere($rootScope.authenticated_user.subscriptions, {
                        sensor_id: $scope.sensor.sensor_id,
                        threshold_id: $rootScope.authenticated_user.currentThreshold.threshold_id
                    });

                    // Check if current Threshold is not already defined in Subscriptions
                    if(result === undefined){

                        // Create new Subscription
                        var subscription = $subscriptionService.getDefault();

                        subscription.sensor_id = $scope.sensor.sensor_id;
                        subscription.threshold_id = $rootScope.authenticated_user.currentThreshold.threshold_id;

                        // Send request
                        $subscriptionService.create(token, $rootScope.authenticated_user.username, subscription)
                        .success(function(response) {

                            // Reset current Subscription
                            delete $scope.currentSubscription;
                            $scope.currentSubscription = undefined;
                            $scope.load_subscriptions();

                        }).error(function(err) {
                            $scope.err = err;
                        });

                    }
                }
            }
        }
    };


    /**
     * Check if User is subscribed with current Threshold to this Sensor
     */
    $scope.check_subscription = function(){

        // Check if User is authenticated
        if($rootScope.authenticated_user){
            if($rootScope.authenticated_user.currentThreshold !== undefined && $rootScope.authenticated_user.currentThreshold.threshold_id !== 0 && $rootScope.authenticated_user.subscriptions.length > 0){

                // Find currentThreshold in subscriptions
                $scope.currentSubscription = _.findWhere($rootScope.authenticated_user.subscriptions, {
                    sensor_id: $scope.sensor.sensor_id,
                    threshold_id: $rootScope.authenticated_user.currentThreshold.threshold_id
                });

                if($scope.currentSubscription !== undefined){
                    $scope.subscribed_status = true;
                } else {
                    $scope.subscribed_status = false;
                }

            } else {
                $scope.subscribed_status = false;
            }
        } else {
            $scope.subscribed_status = false;
        }
    };


    /**
     * Update when user logged out or set a new current Threshold
     */
    $rootScope.$on('update', function() {

        // Save visible status for redrawing
        if($scope.options.series.length == 5){
            $scope.status = {
                gauge_zero: $scope.options.series[0].visible,
                sensor_height: $scope.options.series[1].visible,
                sensor_threshold: $scope.options.series[2].visible,
                crossing_height: $scope.options.series[3].visible,
                warning_threshold: false,
                critical_threshold: false,
                water_level: $scope.options.series[4].visible
            };
        } else {
            $scope.status = {
                gauge_zero: $scope.options.series[0].visible,
                sensor_height: $scope.options.series[1].visible,
                sensor_threshold: $scope.options.series[2].visible,
                crossing_height: $scope.options.series[3].visible,
                warning_threshold: $scope.options.series[4].visible,
                critical_threshold: $scope.options.series[5].visible,
                water_level: $scope.options.series[6].visible
            };
        }

        // Reset Series for Linechart
        $scope.options.series = [];

        // Reload
        $scope.load();
    });


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

                    var dot = {
                        timestamp: new Date(timeserie.measurement_date),
                        water_level: timeserie.water_level,
                        sensor_height: $scope.sensor.sensor_height,
                        crossing_height: $scope.sensor.crossing_height,
                        gauge_zero: 0,
                        sensor_threshold_value: $scope.sensor.threshold_value
                    };

                    // Check if User is authenticated
                    if($rootScope.authenticated_user !== undefined){

                        // Check if User has set a current Threshold
                        if($rootScope.authenticated_user.currentThreshold.threshold_id !== 0) {

                            // Add Warning Threshold to chart
                            dot.warning_threshold = $scope.sensor.crossing_height + $rootScope.authenticated_user.currentThreshold.warning_threshold;

                            // Add Critical Threshold to chart
                            dot.critical_threshold = $scope.sensor.crossing_height + $rootScope.authenticated_user.currentThreshold.critical_threshold;
                        }
                    }

                    // Draw dot
                    $scope.data.dataset.push(dot);
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
            visible: $scope.status.gauge_zero,
            axis: "y",
            dataset: "dataset",
            key: "gauge_zero",
            label: $filter('translate')("GAUGE_ZERO"),
            color: "rgba(0, 0, 0, 1)",
            type: [
                "line"
            ],
            id: "gaugeZero"
        });

        // Create Sensor-Height-Serie
        $scope.options.series.push({
            visible: $scope.status.sensor_height,
            axis: "y",
            dataset: "dataset",
            key: "sensor_height",
            label: $filter('translate')("SENSOR_HEIGHT"),
            color: "rgba(128, 128, 128, 1)",
            type: [
                "line"
            ],
            id: "sensorHeight"
        });

        // Create Sensor-Threshold-Height-Serie
        $scope.options.series.push({
            visible: $scope.status.sensor_threshold,
            axis: "y",
            dataset: "dataset",
            key: "sensor_threshold_value",
            label: $filter('translate')("SENSOR_THRESHOLD_HEIGHT"),
            color: "rgba(0, 204, 204, 1)",
            type: [
                "line"
            ],
            id: "sensorThresholdHeight"
        });

        // Create Crossing-Height-Serie
        $scope.options.series.push({
            visible: $scope.status.crossing_height,
            axis: "y",
            dataset: "dataset",
            key: "crossing_height",
            label: $filter('translate')("CROSSING_HEIGHT"),
            color: "rgba(102, 0, 102, 1)",
            type: [
                "line"
            ],
            id: "crossingHeight"
        });


        // Check if User is authenticated
        if($rootScope.authenticated_user !== undefined){

            // Check if User has set a current Threshold
            if($rootScope.authenticated_user.currentThreshold.threshold_id !== 0) {

                // Create Warning-Threshold-Serie
                $scope.options.series.push({
                    visible: $scope.status.warning_threshold,
                    axis: "y",
                    dataset: "dataset",
                    key: "warning_threshold",
                    label: $filter('translate')("WARNING_THRESHOLD"),
                    color: "rgba(255, 128, 0, 1)",
                    type: [
                        "line"
                    ],
                    id: "warningThreshold"
                });

                // Create Critical-Threshold-Serie
                $scope.options.series.push({
                    visible: $scope.status.critical_threshold,
                    axis: "y",
                    dataset: "dataset",
                    key: "critical_threshold",
                    label: $filter('translate')("CRITICAL_THRESHOLD"),
                    color: "rgba(255, 0, 0, 1)",
                    type: [
                        "line"
                    ],
                    id: "criticalThreshold"
                });
            }
        }

        // Create Timeseries-Serie
        $scope.options.series.push({
            visible: $scope.status.water_level,
            axis: "y",
            dataset: "dataset",
            key: "water_level",
            label: $filter('translate')("WATER_LEVEL"),
            color: "rgba(2, 117, 216, 1)",
            type: [
                "line",
                "area"
            ],
            id: "mainWaterLevels"
        });

        // Refresh Chart
        $scope.update_timeseries();
    };


    /**
     * Load Subscriptions
     */
    $scope.load_subscriptions = function(){

        // Check if User is authenticated
        var token = "";
        if ($rootScope.authenticated_user) {
            token = $rootScope.authenticated_user.token;

            // Load Subscriptions
            $subscriptionService.list($scope.authenticated_user.token, $rootScope.authenticated_user.username).success(function(response){
                $rootScope.authenticated_user.subscriptions = response;

                // Check Subscriptions
                $scope.check_subscription();

            }).error(function(err){
                $scope.err = err;
            });
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

        // Prepare Icon
        var _icon = $scope.main_defaultIcon;

        // Check if User is authenticated
        if($rootScope.authenticated_user !== undefined){

            // Check if User has set a current Threshold
            if($rootScope.authenticated_user.currentThreshold.threshold_id !== 0) {

                // Check if water_level exists
                if($scope.sensor.latest_measurement.water_level !== undefined){
                    if($scope.sensor.latest_measurement.water_level >= $scope.sensor.crossing_height + $rootScope.authenticated_user.currentThreshold.warning_threshold && $scope.sensor.latest_measurement.water_level < $scope.sensor.crossing_height + $rootScope.authenticated_user.currentThreshold.critical_threshold){
                        _icon = $scope.warningIcon;
                    } else if($scope.sensor.latest_measurement.water_level >= $scope.sensor.crossing_height + $rootScope.authenticated_user.currentThreshold.critical_threshold) {
                        _icon = $scope.main_dangerIcon;
                    } else {
                        _icon = $scope.main_successIcon;
                    }
                }
            }
        }

        // Check if latest measurement exists
        var water_level = "-";
        if ($scope.sensor.latest_measurement.water_level !== undefined) {
            water_level = ($scope.sensor.latest_measurement.water_level / 100).toFixed(3) + " m";
        }

        // Check online-status of sensor
        var online_status = '<span class="text-danger online_status_point"><i class="fa fa-circle" aria-hidden="true"></i></span>';
        if ($scope.sensor.online_status) {
            online_status = '<span class="text-success online_status_point"><i class="fa fa-circle" aria-hidden="true"></i></span>';
        }

        // Create Popup-Message
        var _message = online_status + '<h6>' + $scope.sensor.description + '</h6>' +
            '<table class="table-sm"><tbody>' +
            '<tr>' +
            '<th>' + '{{ \'DEVICE_ID\' | translate }}' + '</th>' +
            '<td><kbd>' + $scope.sensor.device_id + '</kbd></td>' +
            '</tr>' +
            '<tr>' +
            '<th>' + '{{ \'WATER_LEVEL\' | translate }}' + '</th>' +
            '<td>' + water_level + '</td>' +
            '</tr>' +
            '</tbody></table>';

        $scope.markers.push({
            layer: 'sensor',
            lat: $scope.sensor.lat,
            lng: $scope.sensor.lng,
            focus: true,
            draggable: false,
            extraClasses:'mainMarker',
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
    };


    /**
     * Update Markers
     */
    $scope.updateMarkers = function(layer) {

        // Check if User is authenticated
        var token = "";
        if ($rootScope.authenticated_user) {
            token = $rootScope.authenticated_user.token;
        }

        if (layer === 'related_sensors') {

            angular.forEach($scope.sensor.related_sensors, function(related_sensor, key) {

                // Request lastest measurement for sensor
                $measurementService.get_latest(token, related_sensor.sensor_id)
                .success(function(response) {
                    $scope.sensor.related_sensors[key].latest_measurement = response;

                    // Prepare Icon
                    var _icon = $scope.defaultIcon;

                    // Check if User is authenticated
                    if($rootScope.authenticated_user !== undefined){

                        // Check if User has set a current Threshold
                        if($rootScope.authenticated_user.currentThreshold.threshold_id !== 0) {

                            // Check if water_level exists
                            if($scope.sensor.related_sensors[key].latest_measurement.water_level !== undefined){
                                if(
                                    ($scope.sensor.related_sensors[key].latest_measurement.water_level >= $scope.sensor.related_sensors[key].crossing_height + $rootScope.authenticated_user.currentThreshold.warning_threshold) && ($scope.sensor.related_sensors[key].latest_measurement.water_level < $scope.sensor.related_sensors[key].crossing_height + $rootScope.authenticated_user.currentThreshold.critical_threshold)){
                                    _icon = $scope.warningIcon;
                                } else if($scope.sensor.related_sensors[key].latest_measurement.water_level >= $scope.sensor.related_sensors[key].crossing_height + $rootScope.authenticated_user.currentThreshold.critical_threshold) {
                                    _icon = $scope.dangerIcon;
                                } else {
                                    _icon = $scope.successIcon;
                                }
                            }
                        }
                    }

                    $scope.markers.push({
                        sensor_id: related_sensor.sensor_id,
                        layer: layer,
                        lat: related_sensor.lat,
                        lng: related_sensor.lng,
                        focus: false,
                        draggable: false,
                        icon: _icon,
                        message: related_sensor.description,
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

                })
                .error(function(err) {
                    $scope.err = err;
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

        // Reset markers for Map
        $scope.markers = [];

        // Reset Datasets for Linechart
        $scope.data = {
            dataset: []
        };

        // Reset realtime
        $scope.realtime = false;

        // Prepare RT-Diagram
        $scope.data_2 = {
            dataset: []
        };

        // Check if User is authenticated
        var token = "";
        if ($rootScope.authenticated_user) {
            token = $rootScope.authenticated_user.token;
        }

        // TODO: Find bug /sensors/sensor_id -> undefined??
        // console.log($routeParams.sensor_id);

        // Request public sensor (or private sensor only when User is authenticated)
        $sensorService.get(token, $routeParams.sensor_id)
            .success(function(response) {
                $scope.sensor = response;

                // Zoom to Sensor on Map
                $scope.center = {
                    lng: $scope.sensor.lng,
                    lat: $scope.sensor.lat,
                    zoom: 18
                };

                // Request lastest measurement for sensor
                $measurementService.get_latest(token, $scope.sensor.sensor_id)
                    .success(function(response) {
                        $scope.sensor.latest_measurement = response;
                        $scope.updateMarker();
                    })
                    .error(function(err) {
                        $scope.err = err;
                    });

                // Load related data
                $scope.load_forecast();
                $scope.load_timeseries();
                $scope.load_related_data();
                $scope.load_subscriptions();
            })
            .error(function(err) {
                $scope.err = err;

                // Redirect
                $location.url("/");
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
        defaultIcon: {
            type: 'awesomeMarker',
            markerColor: 'gray',
            prefix: 'fa',
            icon: 'cube'
        },
        main_defaultIcon: {
            type: 'awesomeMarker',
            markerColor: 'gray',
            prefix: 'fa',
            icon: 'star'
        },
        successIcon: {
            type: 'awesomeMarker',
            markerColor: 'green',
            prefix: 'fa',
            icon: 'cube'
        },
        main_successIcon: {
            type: 'awesomeMarker',
            markerColor: 'green',
            prefix: 'fa',
            icon: 'star'
        },
        warningIcon: {
            type: 'awesomeMarker',
            markerColor: 'orange',
            prefix: 'fa',
            icon: 'cube'
        },
        main_warningIcon: {
            type: 'awesomeMarker',
            markerColor: 'orange',
            prefix: 'fa',
            icon: 'star'
        },
        dangerIcon: {
            type: 'awesomeMarker',
            markerColor: 'red',
            prefix: 'fa',
            icon: 'cube'
        },
        main_dangerIcon: {
            type: 'awesomeMarker',
            markerColor: 'red',
            prefix: 'fa',
            icon: 'star'
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
        legend: {
            position: 'bottomleft',
            colors: [
                '#70B211',
                '#F8981B',
                '#D83D20',
                '#575757',
                '#0066A5',
                '#30A8DE'
            ],
            labels: [
                $filter('translate')('PASSABLE'),
                $filter('translate')('RISK'),
                $filter('translate')('HIGH_RISK'),
                $filter('translate')('N_A'),
                $filter('translate')('EMERGENCY_STATION'),
                $filter('translate')('SERIVE_STATION')
            ]
        },
        events: {
            map: {
                enable: [
                    'leafletDirectiveMap.click',
                    'leafletDirectiveMap.dblclick'
                ],
                logic: 'emit'
            }
        }
    });


    /**
     * Center marker when clicked
     * (Map function)
     */
    $scope.$on("leafletDirectiveMarker.map_2.click", function(event, args) {
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

    // Prepare visible status for series of Linechart
    $scope.status = {
        gauge_zero: true,
        sensor_height: false,
        crossing_height: true,
        sensor_threshold: false,
        warning_threshold: false,
        critical_threshold: false,
        water_level: true
    };

    // Init weather forecast
    $scope.weather_forecast_status = true;
    $scope.weather_interval = 'hourly';
    $scope.weather_measurements = false;

    // Prepare Subscription
    $scope.currentSubscription = undefined;
    $scope.subscribed_status = false;


    /***************************************
     * REALTIME
     ***************************************/

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

             // Load latest value and build chart
             $scope.load_realtime();
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
         console.log("Realtime data received", data);
         $scope.load_realtime_value(data);
     });


     /**
      * Update Realtime Chart with realtime value from Sockets
      */
    $scope.load_realtime_value = function(measurement) {
      var dot = {
          timestamp: new Date(measurement.properties.timestamp),
          water_level: $scope.sensor.sensor_height - measurement.properties.distance.value,
          sensor_height: $scope.sensor.sensor_height,
          crossing_height: $scope.sensor.crossing_height,
          gauge_zero: 0,
          sensor_threshold_value: $scope.sensor.threshold_value
      };

      // Draw dot
      $scope.data_2.dataset.push(dot);
    };

     /**
      * Update Realtime Chart with lastes value in DB
      */
     $scope.update_realtime = function() {

         // Reset Dataset
         $scope.data_2.dataset = [];
         
         // Check if User is authenticated
         var token;
         if ($rootScope.authenticated_user) {
             token = $rootScope.authenticated_user.token;
         } else {
             token = "";
         }

         // Request lastest measurement for sensor
         $measurementService.get_latest(token, $scope.sensor.sensor_id)
         .success(function(response) {
             var dot = {
                 timestamp: new Date(response.measurement_timestamp),
                 water_level: response.water_level,
                 sensor_height: $scope.sensor.sensor_height,
                 crossing_height: $scope.sensor.crossing_height,
                 gauge_zero: 0,
                 sensor_threshold_value: $scope.sensor.threshold_value
             };

             // Draw dot
             $scope.data_2.dataset.push(dot);
         })
         .error(function(err) {
             $scope.err = err;
         });
     };


     /**
      * Load Realtime for Sensor
      */
     $scope.load_realtime = function() {

         // Create Gauge-Zero-Serie
         $scope.options_2.series.push({
             visible: $scope.status.gauge_zero,
             axis: "y",
             dataset: "dataset",
             key: "gauge_zero",
             label: $filter('translate')("GAUGE_ZERO"),
             color: "rgba(0, 0, 0, 1)",
             type: [
                 "line",
                 "dot",
             ],
             id: "gaugeZero"
         });

         // Create Sensor-Height-Serie
         $scope.options_2.series.push({
             visible: $scope.status.sensor_height,
             axis: "y",
             dataset: "dataset",
             key: "sensor_height",
             label: $filter('translate')("SENSOR_HEIGHT"),
             color: "rgba(128, 128, 128, 1)",
             type: [
                 "line",
                 "dot",
             ],
             id: "sensorHeight"
         });

         // Create Sensor-Threshold-Height-Serie
         $scope.options_2.series.push({
             visible: $scope.status.sensor_threshold,
             axis: "y",
             dataset: "dataset",
             key: "sensor_threshold_value",
             label: $filter('translate')("SENSOR_THRESHOLD_HEIGHT"),
             color: "rgba(0, 204, 204, 1)",
             type: [
                 "line",
                 "dot",
             ],
             id: "sensorThresholdHeight"
         });

         // Create Crossing-Height-Serie
         $scope.options_2.series.push({
             visible: $scope.status.crossing_height,
             axis: "y",
             dataset: "dataset",
             key: "crossing_height",
             label: $filter('translate')("CROSSING_HEIGHT"),
             color: "rgba(102, 0, 102, 1)",
             type: [
                 "line",
                 "dot",
             ],
             id: "crossingHeight"
         });


         // Create Measurement values
         $scope.options_2.series.push({
             visible: $scope.status.water_level,
             axis: "y",
             dataset: "dataset",
             key: "water_level",
             label: $filter('translate')("WATER_LEVEL"),
             color: "rgba(2, 117, 216, 1)",
             type: [
                 "line",
                 "dot",
                 "area"
             ],
             id: "mainWaterLevels"
         });

         // Refresh Chart
         $scope.update_realtime();
     };


     /**
      * Linechart
      */
     $scope.options_2 = {
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

});
