var app = angular.module( 'memotown' );

function MemoListController($scope, $injector) {
  var auth = $injector.get('auth');
  var Flash = $injector.get('Flash');
  var $geolocation = $injector.get('$geolocation');
  var $http = $injector.get('$http');
  var uiGmapGoogleMapApi = $injector.get('uiGmapGoogleMapApi');

  $scope.memo_list = [];
  $scope.map = {};
  $scope.markers = [];
  $scope.my_position = {};
  $scope.auth = auth;

  $scope.map_options = {
    streetViewControl: false,
    mapTypeControl: false,
    panControl: false,
    rotateControl: false,
    scrollwheel: false
  }

  var position_promise = $geolocation.getCurrentPosition(geo_options);

  position_promise.then(function(position) {
    $scope.map = {
      center: {
        latitude:  position.coords.latitude,
        longitude: position.coords.longitude
      },
      zoom: 16
    };
  });

  position_promise.then(function(position){
    uiGmapGoogleMapApi.then(function(maps) {
      $scope.my_marker = {
        id: '-1',
        coords: {
          latitude:  position.coords.latitude,
          longitude: position.coords.longitude
        },
        options: {
          draggable: false,
          clickable: false,
          icon: '/img/circle.svg',
          animation: maps.Animation.DROP
        }
      };

    });
  });

  uiGmapGoogleMapApi.then(function(maps) {
    $scope.markersOptions = {
      animation: maps.Animation.DROP
    };
  });

  position_promise.then(function(position){
    $http({
      method: 'POST',
      url: '/api/memos/near',
      data: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }
    })
    .then(function(response) {
      $scope.memo_list = response.data.map(function(memo) {
        memo.coordinates = {
          longitude: memo.loc.coordinates[0],
          latitude: memo.loc.coordinates[1]
        };
        memo.distance = geolib.getDistance({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }, memo.coordinates);
        return memo;
      });

      $scope.markers = $scope.memo_list.map(function(one_memo) {
        return {
          id: one_memo._id,
          longitude: one_memo.loc.coordinates[0],
          latitude: one_memo.loc.coordinates[1],
          title: one_memo.message,
          name: one_memo.name,
          icon: '/assets/img/comment-map-icon.png'
        }
      });

      $scope.markersEvents = {
        click: function(marker, eventName, model, arguments) {
          $scope.window.model = model;
          $scope.window.title = model.title;
          $scope.window.name = model.name;
          $scope.window.show = true;
        }
      };

      $scope.window = {
        marker: {},
        show: false,
        closeClick: function() {
          this.show = false;
        },
        title: ''
      };
    }, function(e) {
      Flash.create('danger', "Server Error: "+e.statusText);
    });
  });
};

app.controller('MemoListController', MemoListController);
