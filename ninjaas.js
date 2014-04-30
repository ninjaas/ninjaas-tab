var app = angular.module('ninjaas_tab',[]);

app.factory('flickrFactory', function($http, $q) {
    var flickrKey = "b48c0c899e10617c2a9f07bf4442e53c";
    return{
        getSizes : function(id) {
            var getSizesUrl = "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key="+flickrKey+"&photo_id="+id+"&format=json&nojsoncallback=1";
            return $http({
                url: getSizesUrl,
                method: 'GET'
            }).then(function (response) {
                return response.data;
            });
        },
        getInfo : function(id) {
            var getInfoUrl = "https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key="+flickrKey+"&photo_id="+id+"&format=json&nojsoncallback=1";
            return $http({
                url: getInfoUrl,
                method: 'GET'
            }).then(function (response) {
                return response.data;
            });
        }
    }
});

app.controller('TodoCtrl',function($scope){
  $scope.init = function(){
    initializeTodo();
  }
  $scope.show = false;

  $scope.hidder = function(){
   $scope.show = $scope.show==true?false:true;
   console.log($scope.show);
  };

  var initializeTodo = function(){
    var toDo = localStorage.toDo;
    if (!toDo){
        var toDo = [];
        localStorage.toDo = angular.toJson(toDo);
    }
    $scope.todos = JSON.parse(localStorage.toDo);
  }

  $scope.addTodo = function() {
    $scope.todos.push({text:$scope.todoText, done:false});
    $scope.todoText = '';
    $scope.updateTodo();
  };
  $scope.updateTodo = function(){
    localStorage.toDo = angular.toJson($scope.todos);
  }
  $scope.strick = function(selected){
    console.log(selected);
    $scope.todos[selected].done = $scope.todos[selected].done==true?false:true;
  }
  
  $scope.remaining = function() {
    var count = 0;
    angular.forEach($scope.todos, function(todo) {
      count += todo.done ? 0 : 1;
    });
    return count;
  };
 
  $scope.archive = function() {
    var oldTodos = $scope.todos;
    $scope.todos = [];
    angular.forEach(oldTodos, function(todo) {
      if (!todo.done) $scope.todos.push(todo);
    });
  };
});

app.filter('pad', function() {
  return function(num) {
    return (num < 10 ? '0' + num : num);
  };
});

app.filter('addSuffix', function() {
  return function(num) {
    if (num % 100 >= 10 && num % 100 <= 19) {
      return num + 'th';
    }

    switch (num % 10) {
      case 1: return num + 'st';
      case 2: return num + 'nd';
      case 3: return num + 'rd';
    }

    return num + 'th';
  };
})

app.controller("ClockController", function($scope, $timeout) {
  $scope.date = new Date();
  $scope.days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  $scope.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  $scope.majors = new Array(12);
  $scope.minors = new Array(60);

  var tick = function() {
    $scope.date = new Date();
    $timeout(tick, 1000);
  };
  $timeout(tick, 1000);
});

app.controller("FocusCtrl",function($scope){
    $scope.init = function(){
        initFocus();
    }
    $scope.count = function(){
      return $scope.focus.length;
    }
    var initFocus = function(){
      var focus = localStorage.focus;
      if (focus){
          $scope.focus = localStorage.focus;
      }else{
          localStorage.focus = "";
          $scope.focus = localStorage.focus;
      }
    }
    $scope.saveFocus = function(){
      localStorage.focus = $scope.focus ;
    }
});

app.controller('BackgroundChanger', function($scope, $http, flickrFactory) {


    $scope.init = function(){
        initializeImages();
        selectBackground(false);
    };

    $scope.hideBox = function(){
      $scope.hide = $scope.hide == true? false:true;
    }

    var initializeImages = function(){
        var images = localStorage.backgroundImages;
        if (!images){
            var backgroundImages = $http({
                url: "backgrounds.json",
                method: "GET"
            }).then(function (response) {
                localStorage.backgroundImages = JSON.stringify(response.data);
                $scope.backgroundImages = JSON.parse(localStorage.backgroundImages);
                selectBackground(false);
            });
        }else{
            $scope.backgroundImages = JSON.parse(localStorage.backgroundImages);
        }
    };


    var loadNewBg = function () {
        var index = localStorage.background;
        var newIndex = Math.floor(Math.random()*$scope.backgroundImages.length);
        if (newIndex == index) newIndex + 1;
        if (newIndex == $scope.backgroundImages.length) newIndex = 0;
        localStorage.background = newIndex;
        return localStorage.background;
    };


    $scope.changeBackground = function(){
        console.log("Changed Background");
        selectBackground(true);
    };
    

    $scope.addBackground = function() {
        id = flickrId($scope.backgroundUrl);
        if(id){
            $scope.backgroundImages.push($scope.backgroundUrl);
            localStorage.backgroundImages = JSON.stringify($scope.backgroundImages);
            $scope.backgroundUrl = "";
            selectBackground(id);
            console.log("Add new flickr background of ID:"+id);
        }else{
            $scope.backgroundUrl = "Wrong URL.";
        }
    };

    var flickrId = function(input){
        re = "photos/[^/]+\/([0-9]+)";
        id = null;
        try{
            var id = input.match(re)[1];
        } catch (e){
            console.log(e);
        }
        return id;
    };

    var selectBackground = function(change) {
        var index = localStorage.background;
        if(localStorage.backgroundStyle&&localStorage.backgroundInfo&&!change){
          console.log("Image and Info exists.");
          $scope.backgroundInfo = JSON.parse(localStorage.backgroundInfo);
          $scope.backgroundStyle = function(){ return JSON.parse(localStorage.backgroundStyle)};
        }else{
            if (index==isNaN||!index||change){
              console.log("Load new image");
              index = loadNewBg();
            }
            var flickrUrl = $scope.backgroundImages[index];
            var id = flickrId(flickrUrl);
            if (change.length==11){
                console.log("Load new image, when image is added from flickr");
                id = change;
            }
            flickrFactory.getSizes(id).then(function(data) {
                 $scope.backgroundStyle =  function(){
                    return {
                        'background': 'url('+data.sizes.size[10].source+') no-repeat center center fixed',
                        'background-size' : 'cover'
                    }
                };
                localStorage.backgroundStyle = JSON.stringify($scope.backgroundStyle());
            });
            flickrFactory.getInfo(id).then(function(data) {
                 $scope.backgroundInfo = {
                        'username': data.photo.owner.username,
                        'title': data.photo.title._content,
                        'url': data.photo.urls.url[0]._content,
                    };
                localStorage.backgroundInfo = JSON.stringify($scope.backgroundInfo);
                console.log(localStorage.backgroundInfo);
            });
        }
    };

});
