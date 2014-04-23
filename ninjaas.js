var app = angular.module('ninjaas_tab',[]);

app.controller('BackgroundChanger', function($scope, $locale) {
    /*
    $scope.backgroundImages = [
        'https://farm8.staticflickr.com/7185/13968522491_079006966f_h.jpg',
        'https://farm8.staticflickr.com/7339/13968132941_f84ec1edf6_h.jpg'];
    */
    $scope.selectBackground = function() {
        return 'https://farm8.staticflickr.com/7339/13968132941_f84ec1edf6_h.jpg';
    };
});