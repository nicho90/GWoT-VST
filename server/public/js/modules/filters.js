var app = angular.module("filters", []);

/**
 * Distance Filter
 * @param  {number} 'distance' [Raw distance value]
 * @return {string} 'distance' [Beautified distance, which will be in km after 1000m]
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
 * @param  {string} 'time' [Raw timestamp]
 * @return {string} 'time' [Beautified timestamp]
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
 * Weekday Filter
 * @param  {number} 'unixtime' [The unixtime in Milliseconds]
 * @return {string} 'weekday' [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday]
 */
app.filter('unixtime', function() {
    return function(unixtime) {
        if(unixtime === undefined){
            return "";
        } else {
            return moment.unix(unixtime).format("dddd");
        }
    };
});


/**
 * Humidity Filter
 * @param  {number} 'humidity' [Raw humidity value]
 * @return {number} 'humidity' [Beautified humidity value]
 */
app.filter('humidity', function() {
    return function(humidity) {
        return (humidity*100).toFixed(2);
    };
});
