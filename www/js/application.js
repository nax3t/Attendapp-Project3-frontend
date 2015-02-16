var app = angular.module("attendapp", ["ionic", "attendapp.factories", "attendapp.controllers", "ngCordova", "ngResource"])

.run(function($ionicPlatform) {
  return $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      return StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider.state("main", {
    url: "/",
    templateUrl: "templates/main.html",
    controller: "UsersCtrl"
  }).state("app.welcome", {
    url: "/welcome",
    views: {
      menuContent: {
        templateUrl: "templates/welcome.html",
        controller: "AppCtrl"
      }
    }
  }).state("signup", {
    url: "/signup",
    templateUrl: "templates/signup.html",
    controller: "UsersCtrl"
  }).state("login", {
    url: "/login",
    templateUrl: "templates/login.html",
    controller: "SessionsCtrl"
  }).state("app", {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: "AppCtrl"
  });

  return $urlRouterProvider.otherwise("/");
});



