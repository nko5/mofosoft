var app = angular.module( 'memotown' );

function MemoController( $injector, $scope, $http, $state, $geolocation) {

  var flash = $injector.get('Flash');
  $scope.loading = false;

  $scope.addMemo = function() {

    $scope.loading = true;

    $geolocation.getCurrentPosition(geo_options)
    .then(function(position) {
      $http({
        method: 'POST',
        url: '/api/memos',
        data: {
          message: $scope.memo,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          generate_fakes: ($scope.fake? true : false)
        }
      })
      .then(function() {
        var message = '<strong>Well done!</strong> You just created a memo.';
        flash.create('success', message);
        $scope.loading = false;

        $state.go('memos');
      }, function(e) {
        $scope.loading = false;
        console.log(e);
        flash.create('danger', "Error");
      });
    });

  }
}

app.controller('MemoController', MemoController);
