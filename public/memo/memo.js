var app = angular.module( 'memotown' );

function MemoController( $injector, $scope, $http, $state, $geolocation) {

  var flash = $injector.get('Flash');
  $scope.loading = false;

  $scope.addMemo = function() {

    $scope.loading = true;

    $geolocation.getCurrentPosition({
      timeout: 5000,
      maximumAge: 500
    })
    .then(function(position) {
      $http({
        method: 'POST',
        url: '/api/memos',
        data: {
          message: $scope.memo,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
      })
      .success(function() {
        var message = '<strong>Well done!</strong> You just created a memo.';
        flash.create('success', message);
        $scope.loading = false;

        $state.go('map');
      })
      .error(function(e) {
        $scope.loading = false;
        console.log(e);
        flash.create('danger', "Error");
      });
    });

  }
}

app.controller('MemoController', MemoController);
