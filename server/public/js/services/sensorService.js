var app=angular.module("sensorService",[]);
/**
 * Sensor Service Provider
 */
app.factory('$sensorService',function($http,config){

  return{
    list:function(){
      return $http.get(config.apiURL+ "/sensors");
    },

  };
});
