var UserFactories;

UserFactories = angular.module("attendapp.factories", []);

UserFactories.factory('User', [
  '$http', function($http) {
    return {
      post: function(newUser) {
        return $http.post("http://localhost:3000/users.json", {
          user: newUser
        });
      }
    };
  }
]);

//https://attendapp-backend.herokuapp.com