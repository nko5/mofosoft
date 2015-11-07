angular.module( 'sample.home', [
'auth0'
])
.controller( 'HomeCtrl', function HomeController( $scope, auth, $http, $location,
  store, uiGmapGoogleMapApi ) {

  $scope.auth = auth;

  $scope.callApi = function() {
    // Just call the API as you'd do using $http
    $http({
      url: 'http://localhost:3000/',
      method: 'GET'
    }).then(function() {
      alert("We got the secured data successfully");
    }, function(response) {
      if (response.status == 0) {
        alert("Please download the API seed so that you can call it.");
      }
      else {
        alert(response.data);
      }
    });
  }

  $scope.logout = function() {
    auth.signout();
    store.remove('profile');
    store.remove('token');
    $location.path('/login');
  }

  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position){
      uiGmapGoogleMapApi.then(function(maps) {
        $scope.map = {
          center: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }, zoom: 8
        };
      });
    });
  }
});
