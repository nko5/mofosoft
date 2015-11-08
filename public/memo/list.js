var app = angular.module( 'memotown' );

function MemoListController($scope, $rootScope, $http, $geolocation) {
  $scope.memo_list = [];
  $scope.map = {};
  $scope.markers = [];
  $scope.my_position = {};

  $scope.map_options = {
    streetViewControl: false,
    mapTypeControl: false,
    panControl: false,
    rotateControl: false,
    scrollwheel: false
  }

  $geolocation
  .getCurrentPosition(geo_options)
  .then(function(position) {
    $scope.map = {
      center: {
        latitude:  position.coords.latitude,
        longitude: position.coords.longitude
      },
      zoom: 16
    };

    $scope.my_marker = {
      id: '-1',
      coords: $scope.map.center,
      options: {
        draggable: false,
        clickable: false,
        icon: '/img/circle.svg',
        animation: google.maps.Animation.DROP
      }
    }

    $http({
      url: '/api/memos'
    })
    .success(function(memos) {
      $scope.memo_list = memos;
      $scope.markers = memos.map(function(one_memo) {
        return {
          id: one_memo._id,
          longitude: one_memo.loc.coordinates[0],
          latitude: one_memo.loc.coordinates[1],
          title: one_memo.message,
          icon: '/assets/img/comment-map-icon.png'
        }
      });

      $scope.markersEvents = {
        click: function(marker, eventName, model, arguments) {
          $scope.window.model = model;
          $scope.window.title = model.title;
          $scope.window.show = true;
        }
      };

      $scope.markersOptions = {
        animation: google.maps.Animation.DROP
      };

      $scope.window = {
        marker: {},
        show: false,
        closeClick: function() {
          this.show = false;
        },
        title: ''
      };
    })
    .error(function(e) {
      console.log(e);
      flash.create('danger', "Error");
    });
  });
};

app.controller('MemoListController', MemoListController);
