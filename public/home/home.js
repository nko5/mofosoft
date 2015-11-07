var app = angular.module( 'memotown' );

app.controller( 'HomeController', [
  '$scope',
  '$http',
  '$location',
  'uiGmapGoogleMapApi',
  '$geolocation',
  function HomeController( $scope, $http, $location,
   uiGmapGoogleMapApi, $geolocation ) {

  $geolocation.getCurrentPosition({
    timeout: 50000
  }).then(function(position) {
    uiGmapGoogleMapApi.then(function(maps) {
      $scope.map = {
        center: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }, zoom: 14
      };
    });
  });
}]);
