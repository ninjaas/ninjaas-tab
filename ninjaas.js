var app = angular.module('ninjaas_tab',[]);

isValidDate = function isValidDate(d) {
  if ( Object.prototype.toString.call(d) !== "[object Date]" ) {
    return false;
  }
  return !isNaN(d.getTime());
};

app.controller('BackgroundChanger', function($scope, $locale) {
    $scope.backgroundImages = [
        'https://farm8.staticflickr.com/7185/13968522491_079006966f_h.jpg',
        'https://farm8.staticflickr.com/7339/13968132941_f84ec1edf6_h.jpg'];

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
        return $scope.backgroundImages[index];
    };

    $scope.backgroundStyle = {
        'background': 'url('+$scope.selectBackground()+') no-repeat center center fixed',
        'background-size' : 'cover'
    };
});
