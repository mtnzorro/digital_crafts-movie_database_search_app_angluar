var app = angular.module('movieApp', ['ui.router']);

app.factory('MovieService', function($http) {
  var service = {};
  var API_KEY = '6587450653d727997cbfe8c034cf9531';
  service.nowPlaying = function() {
    var url = 'http://api.themoviedb.org/3/movie/now_playing';
    return $http({
      method: 'GET',
      url: url,
      params: { api_key: API_KEY }
    });
  };

  service.nowPopular = function() {
    var url = 'http://api.themoviedb.org/3/movie/popular';
    return $http({
      method: 'GET',
      url: url,
      params: { api_key: API_KEY }
    });
  };

  service.upcoming = function() {
    var url = 'http://api.themoviedb.org/3/movie/upcoming';
    return $http({
      method: 'GET',
      url: url,
      params: { api_key: API_KEY }
    });
  };

  service.kidsPopular = function() {
    var url = 'http://api.themoviedb.org/3/discover/movie?certification_country=US&certification.lte=G&sort_by=popularity.desc&api_key=6587450653d727997cbfe8c034cf9531';
    return $http({
      method: 'GET',
      url: url
    });
  };

  service.movieDetails = function(movieId) {
    var url = 'http://api.themoviedb.org/3/movie/' + movieId;
    return $http({
      method: 'GET',
      url: url,
      params: { api_key: API_KEY }
    });
  };

  service.movieSearch = function(movieId) {
    var url = 'http://api.themoviedb.org/3/search/movie' ;
    return $http({
      method: 'GET',
      url: url,
      params: { api_key: API_KEY, query: movieId }
    });
  };

  return service;
});

app.controller('searchPage', function($scope, $stateParams, $state, MovieService) {
  $scope.movieName = '';
  MovieService.nowPlaying()
  .success(function(data) {
    // got movie results
    $scope.results = data.results;
    $scope.results = $scope.results.splice(0,6);
    console.log("Now Playing:"+ $scope.results);

  });

  $scope.search_call = function(){
    $state.go('search_result_view', {page_name: $scope.movieName});
  };
});

app.controller('search_resultPage', function($scope, $stateParams, $state, MovieService) {

  $scope.query  = $stateParams.page_name;
    $scope.movieName = '';
    MovieService.movieSearch($scope.query)
    .success(function(data) {
      $scope.results = data.results;
      $scope.id_no = data.results.id;
    });

    $scope.search_call = function(){
      $state.go('search_result_view', {page_name: $scope.movieName});
    };
    $scope.getPopular = function(){
      $state.go('popular_page');
    };
    $scope.getKids = function(){
      $state.go('kids_page');
    };
    $scope.getUpcoming = function(){
      $state.go('upcoming_page');
    };
});

app.controller('info_viewPage', function($scope, $stateParams, $state, MovieService) {
  $scope.query  = $stateParams.page_name;
    $scope.movieName = '';
    MovieService.movieDetails($scope.query)
    .success(function(data) {
      // got movie results
      $scope.results = data;
      console.log($scope.results);
      $scope.genres = data.genres;
    });
    $scope.search_call = function(){
      $state.go('search_result_view', {page_name: $scope.movieName});
    };
    $scope.getPopular = function(){
      $state.go('popular_page');
    };
    $scope.getKids = function(){
      $state.go('kids_page');
    };
    $scope.getUpcoming = function(){
      $state.go('upcoming_page');
    };
});

app.controller('popular_Page', function($scope, $stateParams, $state, MovieService) {
      $scope.movieName = '';
      MovieService.nowPopular()
      .success(function(data) {
        // got movie results
        $scope.results = data.results;
        $scope.results = $scope.results.splice(0,6);
        console.log("Popular Playing:"+ $scope.results);
      });

      $scope.search_call = function(){
        $state.go('search_result_view', {page_name: $scope.movieName});
      };
});

app.controller('kidsPage', function($scope, $stateParams, $state, MovieService) {
      $scope.movieName = '';
      MovieService.kidsPopular()
      .success(function(data) {
        // got movie results
        $scope.results = data.results;
        $scope.results = $scope.results.splice(0,6);
        console.log("Kids Playing:"+ $scope.results);
      });

      $scope.search_call = function(){
        $state.go('search_result_view', {page_name: $scope.movieName});
      };
});

app.controller('upcomingPage', function($scope, $stateParams, $state, MovieService) {
      $scope.movieName = '';
      MovieService.upcoming()
      .success(function(data) {
        // got movie results
        $scope.results = data.results;
        $scope.results = $scope.results.splice(0,6);
        console.log("Upcoming Playing:"+ $scope.results);
      });

      $scope.search_call = function(){
        $state.go('search_result_view', {page_name: $scope.movieName});
      };
});

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state({
      name: 'search_view',
      url: '/',
      templateUrl: 'search.html',
      controller: 'searchPage'
    })

    .state({
      name: 'search_result_view',
      url: '/search/{page_name}',
      templateUrl: 'search_result.html',
      controller: 'search_resultPage'
    })

    .state({
      name: 'popular_page',
      url: '/popular/',
      templateUrl: 'search.html',
      controller: 'popular_Page'
    })

    .state({
      name: 'kids_page',
      url: '/kids_page/',
      templateUrl: 'search.html',
      controller: 'kidsPage'
    })

    .state({
      name: 'upcoming_page',
      url: '/upcoming/',
      templateUrl: 'search.html',
      controller: 'upcomingPage'
    })

    .state({
      name: 'info_view',
      url: '/movie/{page_name}',
      templateUrl: 'info_view.html',
      controller: 'info_viewPage'
    });

    $urlRouterProvider.otherwise('/');
});
