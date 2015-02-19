angular.module('attendapp.controllers', [])

.controller("AppCtrl", function($scope, $ionicModal, $http, $rootScope, $state, $cordovaBarcodeScanner, Attendance) {
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
    return $http["delete"]("https://attendapp-backend.herokuapp.com/sessions/" + $rootScope.current_user.id + ".json").success(function(data) {
      return $state.go('main');
    });
  }
})

.controller("UsersCtrl", [
  "$scope", "$http", '$stateParams', '$state', '$location', '$rootScope', 'User', function($scope, $http, $stateParams, $state, $location, $rootScope, User) {
    $scope.newUser = {};
    return $scope.createUser = function() {
      return User.post($scope.newUser).success(function(data) {
        $rootScope.current_user = data;
        return $state.go('app.welcome');
      });
    };
  }
])

.controller("SessionsCtrl", [
  "$scope", "$http", "$rootScope", "$location", '$state', function($scope, $http, $rootScope, $location, $state) {
    return $scope.addSession = function(loginUser) {
      return $http.post("https://attendapp-backend.herokuapp.com/login.json", {
        user: loginUser
      }).success(function(user) {
        $rootScope.current_user = user;
        return $state.go('app.welcome');
      });
    };
  }
])
