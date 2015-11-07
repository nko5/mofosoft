var app = angular.module( 'memotown' );

function MemoListController($scope, $rootScope, $http, $geolocation) {
  $scope.memo_list = [];
  $scope.map_center = {};
  $scope.map_zoom = 14;
  $scope.markers = [];

  $scope.map_center = {
    latitude:  $rootScope.map_location.latitude,
    longitude: $rootScope.map_location.longitude
  };

  $geolocation
  .getCurrentPosition($rootScope.geo_options)
  .then(function(position) {
    $scope.map_center = {
      latitude:  position.coords.latitude,
      longitude: position.coords.longitude
    };

    $http({
      url: '/api/memos'
    }).success(function(memos) {
      $scope.memo_list = memos;
      $scope.markers = memos.map(function(one_memo) {
        return {
          id: one_memo._id,
          longitude: one_memo.loc.coordinates[0],
          latitude: one_memo.loc.coordinates[1],
          title: one_memo.message
        }
      });
    }).error(function(e) {
      console.log(e);
      flash.create('danger', "Error");
    });
  });

};

app.controller('MemoListController', MemoListController);
