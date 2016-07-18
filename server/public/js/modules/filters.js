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
 * Water Level Filter
 * @param  {number} 'water_level' [Raw water level]
 * @return {string} 'water_level' [Beautified water level in Meters]
 */
app.filter('water_level', function() {
    return function(water_level) {
        if(water_level !== undefined && typeof(water_level) === 'number') {
            return (water_level/100).toFixed(3) + "m";
        } else {
            return "-";
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
        if(time === undefined || time === ""){
            return "-";
        } else {
            return moment(time).format("DD.MM.YYYY HH:mm:ss");
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
 * Month Filter
 * @param  {number} 'month' [1,2,3,4,5,6,7,8,9,10,11,12]
 * @return {string} 'month' [JANUARY, FEBRUARY, MARCH, APRIL, MAY, JUNE, JULY, AUGUST, SEPTEMBER, OCTOBER, NOVEMBER, DECEMBER]
 */
app.filter('month', function() {
    return function(month) {
        if(month === undefined){
            return "";
        } else {
            switch (month) {
                case 1:
                    return "JANUARY";
                case 2:
                    return "FEBRUARY";
                case 3:
                    return "MARCH";
                case 4:
                    return "APRIL";
                case 5:
                    return "MAY";
                case 6:
                    return "JUNE";
                case 7:
                    return "JULY";
                case 8:
                    return "AUGUST";
                case 9:
                    return "SEPTEMBER";
                case 10:
                    return "OCTOBER";
                case 11:
                    return "NOVEMBER";
                case 12:
                    return "DECEMBER";
                default: {
                    return "";
                }
            }
        }
    };
});


/**
 * Hours Filter
 * @param  {number} 'unixtime' [The unixtime in Milliseconds]
 * @return {string} 'time' [12:00, 13:00, etc.]
 */
app.filter('unixtime_2', function() {
    return function(unixtime) {
        if(unixtime === undefined){
            return "";
        } else {
            return moment.unix(unixtime).format("HH:mm");
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
