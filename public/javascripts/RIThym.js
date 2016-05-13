var app = angular.module('RIThym',['ngResource','ngRoute','ngMap']);

app.config(['$routeProvider', function($routeProvider){
    $routeProvider
    .when('/', {
        templateUrl: 'partials/home.html',
        controller: 'HomeCtrl'
    })
    .otherwise({
        redirectTo: '/'
    });
}]);

app.controller('HomeCtrl',['$scope','$resource', 'NgMap',
function($scope, $resource, NgMap){
    /*var Locations = $resource('/api/locations');
    Locations.query(function(locations){
        $scope.locations = locations;
    });//*/
    
    NgMap.getMap().then(function(map){
        console.log(map);
    })
    .catch(function(error){
        console.log(error);
    });
}]);