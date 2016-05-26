var app = angular.module('RIThym',['ngRoute','ngMap']);

app.config(['$routeProvider', function($routeProvider){
    $routeProvider
    .when('/', {
        templateUrl: 'partials/home.html',
        controller: 'HomeCtrl'
    })
    .when('/add-location', {
        templateUrl: 'partials/location-form.html',
        controller: 'AddLocationCtrl'
    })
    .when('/location/:id',{
        templateUrl: 'partials/location-form.html',
        controller: 'EditLocationCtrl'
    })
    .otherwise({
        redirectTo: '/'
    });
}]);

app.controller('HomeCtrl',['$scope','$http', 'NgMap',
function($scope, $http, NgMap){
    //Making a call to the API to get the locations
    $http.get('/api/locations')                 //Using GET for read
    .then(function(response){
        //Getting the map reference
        NgMap.getMap("map").then(function(map){
            //Trys to find the user location and set the center of the map there
            if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition(function(position){                                //Success callback set's the center to the user location
                    map.setCenter({lat: position.coords.latitude, lng: position.coords.longitude});
                }, function(){                                                                              //Error callback, set location to NYC
                    var ny = {lat: 40.69847032728747, lng: -73.9514422416687};
                    return ny;
                }, {timeout:60000});
            }
            else{
                console.log("Your browser does not handle geolocation");
            }
            
            var infoWindow = new google.maps.InfoWindow();                                                                          //Init this outside the for loop to make sure that only 1 instance of infoWindow is open at a time.
            //Looping through each location
            for(var i=0; i < response.data.length; i++){
                var contentString = response.data[i].name+'<br>'+response.data[i].address+'<br>Practices:<br>';
                //looping through the practices and adding it to the content string
                for(var j=0; j < response.data[i].practices.length; j++){
                    contentString += response.data[i].practices[j].day+': '+response.data[i].practices[j].start_time+' - '+response.data[i].practices[j].end_time+'<br>';
                }
                contentString += '<a href="/#/location/'+response.data[i]._id+'">edit</a><a href="" class="del">delete</a>';        //Adding edit and flag for deletion links to the  content string

                //Placing a marker for each location
                var marker = new google.maps.Marker({       
                    position: response.data[i].location,
                    map: map
                });
                
                //Using closures for adding an infowindow to each marker to fix the problem of an infowindow only being added to the last marker.
                google.maps.event.addListener(marker,'click',(function(marker,contentString,infoWindow){        //3rd param is an anonymus function that takes the marker, contentString, and infowindow
                    return function(){
                        infoWindow.setContent(contentString);
                        infoWindow.open(map,marker);
                    };
                })(marker,contentString,infoWindow));
            }
        })//map
        .catch(function(error){
            console.log(error);
        });
    });//then
}]);//HomeCtrl

app.controller('AddLocationCtrl',['$scope','$http','$location',
function($scope, $http, $location){
    $scope.save = function(){
        var practices = [];
        var url = "https://maps.googleapis.com/maps/api/geocode/json?address="+$scope.location.address.replace(/ /g,"+");
        
        //ToDo: client side validation
        
        //If there are practices
        if($scope.days){
            for(dayName in $scope.days){                                                            //Loop through the days object              
                var day = $scope.days[dayName];                                                     //Gets the day pratice object
                practices.push({day: dayName, start_time: day.startTime, end_time: day.endTime});    //Add the pratice object to the practices array
            }
        }
        //Call to get the lat lng and formatted address from Google Map's service
        $http.get(url)
        .then(function(response){
            locJSON = response.data.results[0];                         //The JSON response
            
            //createing an object to send to the backend to save
            var locObj = {
                name: $scope.location.name,
                address: locJSON.formatted_address,
                location: locJSON.geometry.location,
                cost: $scope.location.cost,
                practices: practices,                                      //TO DO later
                notes: $scope.location.notes
            };
            
            //Sending using POST since a new object is being created
            $http.post('/api/locations', locObj)
            .then(
                $location.path('/')                                     //Redirects the user back to the homepage 
            );
        });//*/
    };
}]);

app.controller('EditLocationCtrl',['$scope','$http','$location', '$routeParams',
    function($scope,$http,$location, $routeParams){
        var path = '/api/locations/'+$routeParams.id;
        $http.get(path)
        .then(function(response){
            console.log(response.data);
            $scope.location = response.data;
            
            for(var i=0; i<response.data.practices.length; i++){
                
            }
        });
}]);