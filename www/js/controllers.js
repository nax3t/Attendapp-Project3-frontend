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
        Attendance.create({ attendance: { name: $scope.user.username, secret: imageData.text } }, function() {
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
  "$scope", "$http", '$state', '$rootScope', '$ionicLoading', 'User', function($scope, $http, $state, $rootScope, $ionicLoading, User) {
    $scope.newUser = {};
    return $scope.createUser = function() {
      $ionicLoading.show();
      return User.post($scope.newUser).success(function(data) {
        $rootScope.current_user = data;
        $ionicLoading.hide();
        return $state.go('app.welcome');
      }).error(function(data) {
        $scope.username = "";
        $scope.password = "";
        $ionicLoading.hide();
        if (data.password) {
          $scope.password = "Password " + data.password[0];
        } else if(data.username) {
          $scope.username = "Username " + data.username[0];
        }
      });
    };
  }
])

.controller("SessionsCtrl", [
  "$scope", "$http", "$rootScope", '$state', '$ionicLoading', function($scope, $http, $rootScope, $state, $ionicLoading) {
    return $scope.addSession = function(newUser) {
      $ionicLoading.show();
      return $http.post("https://attendapp-backend.herokuapp.com/login.json", {
        user: newUser
      }).success(function(user) {
        $rootScope.current_user = user;
       $ionicLoading.hide();
        return $state.go('app.welcome');
      }).error(function(data) {
        $ionicLoading.hide();
        $scope.error = "Invalid username or password"
      });
    };
  }
])
