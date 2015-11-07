var app = angular.module( 'memotown' );

app.controller('LoginController',
  ['$scope', 'auth', '$location', 'store',
  function LoginController( $scope, auth, $location, store ) {

    $scope.login = function() {
      auth.signin({}, function(profile, token) {
        store.set('profile', profile);
        store.set('token', token);
        $location.path("/");
      }, function(error) {
        console.log("There was an error logging in", error);
      });
    }
  }]
);
