angular.module( 'sample.memo', [
'auth0'
])
.controller('MemoCtrl', function MemoController( $scope, auth, $http, $location,
  store, Flash, $geolocation) {
  $scope.auth = auth;

  $geolocation.getCurrentPosition({
    timeout: 50000
  }).then(function(position) {
    $scope.latitude = position.coords.latitude;
    $scope.longitude = position.coords.longitude;
  });

  $scope.addMemo = function() {
    $http({
      method: 'POST',
      url: '/api/postmemo',
      data: {
        message: $scope.memo.message,
        latitude: $scope.latitude,
        longitude: $scope.longitude
      }
    }).success(function() {
      var message = '<strong>Well done!</strong> You just created a memo.';
      Flash.create('success', message);

      $location.path('/');
    }).error(function() {
      alert("Error");
    });
  }
});
