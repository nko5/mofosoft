angular.module( 'sample.memo', [
'auth0'
])
.controller('MemoCtrl', function MemoController( $scope, auth, $http, $location, store, Flash) {
  $scope.auth = auth;

  $scope.addMemo = function() {
    $http({
      method: 'POST',
      url: '/api/postmemo',
      data: {
        message: $scope.memo.message
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
