var app=angular.module("sensorService",[]);
/**
 * Sensor Service Provider
 */
app.factory('$sensorService',function($http,config){

  return{
    list_public:function(){
      return $http.get(config.apiURL+ "/sensors");
    },
    list_private:function(token, username, query){
      return $http.get(config.apiURL + "/users/" + username + "/sensors/" + query,
          {
            headers: { 'token': token}
          });
    }

  };
});
