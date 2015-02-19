angular.module('attendapp.controllers', [])

.controller("AppCtrl", ['$scope', '$ionicModal', '$http', '$rootScope', '$state', '$cordovaBarcodeScanner', '$ionicLoading', 'Attendance', function($scope, $ionicModal, $http, $rootScope, $state, $cordovaBarcodeScanner, $ionicLoading, Attendance) {
  $scope.user = $rootScope.current_user;
  $scope.attendances = Attendance.query();
  $scope.refreshAttendance = function() {
    $scope.attendances = Attendance.query();
  }
  $scope.deleteAttendance = function(attendanceId) {
    $scope.attendances.forEach(function(attendance, index) {
      if (attendanceId === attendance.id) {
        attendance.$delete({ id: attendanceId }, function() {
          $scope.attendances.splice(index, 1);
        });
      }
    });
  }
  $scope.scanQRCode = function() {
    $cordovaBarcodeScanner.scan().then(function(imageData) {
        Attendance.create({ attendance: { name: imageData.text, user_id: $scope.user.id } }, function() {
          $scope.attendances = Attendance.query();
          return $state.go('app.welcome');
        });
    }, function(error) {
        console.log("An error happened -> " + error);
    });
  };
  return $scope.logout = function() {
    $ionicLoading.show();
    return $http["delete"]("https://attendapp-backend.herokuapp.com/sessions/" + $rootScope.current_user.id + ".json").success(function(data) {
      $ionicLoading.hide()
      return $state.go('main');
    });
  }
}])

.controller("UsersCtrl", [
  "$scope", "$http", '$state', '$location', '$rootScope', '$ionicLoading', 'User', function($scope, $http, $state, $location, $rootScope, $ionicLoading, User) {
    $scope.newUser = {};
    return $scope.createUser = function() {
      $ionicLoading.show();
      return User.post($scope.newUser).success(function(data) {
        $rootScope.current_user = data;
        $ionicLoading.hide();
        return $state.go('app.welcome');
      });
    };
  }
])

.controller("SessionsCtrl", [
  "$scope", "$http", "$rootScope", "$location", '$state', '$ionicLoading', function($scope, $http, $rootScope, $location, $state, $ionicLoading) {
    return $scope.addSession = function(loginUser) {
      $ionicLoading.show();
      return $http.post("https://attendapp-backend.herokuapp.com/login.json", {
        user: loginUser
      }).success(function(user) {
        $rootScope.current_user = user;
        $ionicLoading.hide();
        return $state.go('app.welcome');
      });
    };
  }
])
