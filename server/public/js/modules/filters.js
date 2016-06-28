var app = angular.module("filters", []);

/**
 * Distance Filter
 * Switch to 1km after 1000m
 */
app.filter('distance', function() {
    return function(distance) {
        if(distance>=1000) {
            return (distance/1000).toFixed(1) + " km";
        } else {
            return distance + " m";
        }
    };
});


/**
 * Timestamp Filter
 */
app.filter('time', function() {
    return function(time) {
        if(time === undefined){
            return "";
        } else {
            return time.substring(0, 10) + " " + time.substring(11, 19);
        }
    };
});


/**
 * Humidity Filter
 */
app.filter('humidity', function() {
    return function(humidity) {
        return (humidity*100).toFixed(2);
    };
});
