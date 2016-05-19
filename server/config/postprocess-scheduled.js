/**
 * Postprocess Observations from the Scheduled topic
 */
exports.process = function(message) {
  var measurements = JSON.parse(message).features;
  var medianMeasurement = median(measurements);
  console.log("Half: ", medianMeasurement);
  // TODO push medianMeasurement to DB
};

var median = function(values) {
    values.sort(function(a, b) {
        return a.properties.distance.value - b.properties.distance.value;
    });
    var half = Math.floor(values.length / 2);
    return values[half];
};
