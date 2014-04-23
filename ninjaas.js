var app = angular.module('ninjaas_tab',[]);

isValidDate = function isValidDate(d) {
  if ( Object.prototype.toString.call(d) !== "[object Date]" ) {
    return false;
  }
  return !isNaN(d.getTime());
};

app.factory('flickrFactory', function($http, $q) {
    var flickrKey = "b48c0c899e10617c2a9f07bf4442e53c";
    return{
        getSizes : function(id) {
            var getSizesUrl = "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key="+flickrKey+"&photo_id="+id+"&format=json&nojsoncallback=1";
            return $http({
                url: getSizesUrl,
                method: 'GET'
            })
        },
        getInfo : function(id) {
            var getInfoUrl = "https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key="+flickrKey+"&photo_id="+id+"&format=json&nojsoncallback=1";
            return $http({
                url: getInfoUrl,
                method: 'GET'
            });
        }
    }
});

app.controller('BackgroundChanger', function($scope, $http, flickrFactory) {

    $scope.backgroundImages = ['13968522491','13976612784','13968027732','13966663232','13966663232','13965592221','13965299902','13968132941'];

    $scope.flickr = function(id){
       $http.get(getSizesUrl).then(function(response) {
            $scope.getSizes = response.data;
            console.log($scope.getSizes.sizes.size[10].source);
            return $scope.getSizes.sizes.size[10].source;
        });
    }

    $scope.loadNewBg = function () {
        var index = localStorage.background;
        var newIndex = Math.floor(Math.random()*$scope.backgroundImages.length);
        if (newIndex == index) newIndex + 1;
        if (newIndex == $scope.backgroundImages.length) newIndex = 0;
        localStorage.background = newIndex;
    }

    $scope.selectBackground = function() {
        $scope.loadNewBg();
        var index = localStorage.getItem("background");
        var flickrId = $scope.backgroundImages[index];
        flickrFactory.getSizes(flickrId).success(function(data) {
             console.log(data);
             $scope.backgroundStyle =  function(){
                return {
                    'background': 'url('+data.sizes.size[10].source+') no-repeat center center fixed',
                    'background-size' : 'cover'
                }
            };
        });
       
    };

    $scope.backgroundStyle =  function(){
        return {
             'background': 'url('+$scope.selectBackground()+') no-repeat center center fixed',
            'background-size' : 'cover'
        }
    };
});
