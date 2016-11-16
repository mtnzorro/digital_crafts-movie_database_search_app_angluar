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
    })
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
    $scope.results = $scope.results.splice(0,10);
    console.log("Now Playing:"+ $scope.results);

  });
  $scope.search_call = function(){
    $state.go('search_result_view', {page_name: $scope.movieName});
  };
});

app.controller('search_resultPage', function($scope, $stateParams, $state, MovieService) {
  $scope.query  = $stateParams.page_name;
    MovieService.movieSearch($scope.query)
    .success(function(data) {
      // got movie results
      $scope.results = data.results;
      $scope.id_no = data.results.id;
      // console.log($scope.results);
      //   console.log($scope.id_no);
    });
});

app.controller('info_viewPage', function($scope, $stateParams, $state, MovieService) {
  $scope.query  = $stateParams.page_name;
    MovieService.movieDetails($scope.query)
    .success(function(data) {
      // got movie results
      $scope.results = data;
      console.log($scope.results);
      $scope.genres = data.genres
    });
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
      name: 'info_view',
      url: '/movie/{page_name}',
      templateUrl: 'info_view.html',
      controller: 'info_viewPage'
    });

    $urlRouterProvider.otherwise('/');
});
