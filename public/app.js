var geo_options = {
  timeout: 5000,
  maximumAge: 500,
  enableHighAccuracy: true
};

var app = angular.module( 'memotown', [
  'auth0',
  'angular-storage',
  'angular-jwt',
  'uiGmapgoogle-maps',
  'flash',
  'ngGeolocation',
  'ui.router',
  'ui.gravatar',
  'angularMoment'
]);

app.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/memos");

  $stateProvider
    .state('login', {
      url: "/login",
      templateUrl: "login/login.html",
      controller: 'LoginController',
      data: {
        title: 'Log In'
      }
    })
    .state('add_memo', {
      url: "/add-memo",
      templateUrl: "memo/add.html",
      controller: 'MemoController',
      data: {
        title: 'Add Your Memo'
      }

    })
    .state('memos', {
      url: "/memos",
      templateUrl: "memo/list.html",
      controller: 'MemoListController',
      data: {
        title: 'List of Local Memos'
      }
    });
})

app.config( function myAppConfig ( authProvider, $httpProvider, $locationProvider,
  jwtInterceptorProvider, uiGmapGoogleMapApiProvider) {

  authProvider.init({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
    loginState: 'login'
  });

  jwtInterceptorProvider.tokenGetter = function(store) {
    return store.get('token');
  }

  // Add a simple interceptor that will fetch all requests and add the jwt token to its authorization header.
  // NOTE: in case you are calling APIs which expect a token signed with a different secret, you might
  // want to check the delegation-token example
  $httpProvider.interceptors.push('jwtInterceptor');

  uiGmapGoogleMapApiProvider.configure({
    key: 'AIzaSyBO7k92dqpBC-jSaoiGozuEFInMFNn5alw',
    v: '3.20',
    libraries: 'geometry,visualization'
  });
});

app.run(function($rootScope, auth, store, jwtHelper, $state, $geolocation) {

  auth.hookEvents();

  $rootScope.map_location = {};
  $rootScope.location_ready = false;

  $geolocation.getCurrentPosition(geo_options)
  .then(function(position) {
    $rootScope.map_location = position.coords;
    $rootScope.location_ready = true;
  });

  $rootScope.$on('$stateChangeStart', function() {
    if (!auth.isAuthenticated) {
      var token = store.get('token');
      if (token) {
        if (!jwtHelper.isTokenExpired(token)) {
          auth.authenticate(store.get('profile'), token);
        } else {
          $state.go('login');
        }
      }
    }
  });
});

app.controller( 'ApplicationController', function ApplicationController ( $scope, $state, auth, store) {
  $scope.auth = auth;

  $scope.logout = function() {
    auth.signout();
    store.remove('profile');
    store.remove('token');
    $state.go('login');
  }

  $scope.$on('$stateChangeSuccess', function(e, next){
    if ( next.data && next.data.title ) {
      $scope.pageTitle = next.data.title + ' | Memo Town' ;
    }
  });
});
