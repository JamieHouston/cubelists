angular.service('Api', function($resource){
  
    return $resource('api/:cubeType/:keyName', {keyName: '', cubeType: 'list'},
        {create: {method: 'POST'}}
    );
});

angular.service('cubesApp', function($route, $location, $window) {

  $route.when('/lists', {template: 'partials/cubes.html', controller: ListController});
  $route.when('/lists/:parentKey', {template: 'partials/cubes.html', controller: ListController});
  $route.when('/setup', {template: 'partials/config.html', controller: ConfigController});
  $route.when('/setup/:parentKey', {template: 'partials/config.html', controller: ConfigController});

  var self = this;

  $route.onChange(function() {
    if ($location.hash === '') {
      $location.updateHash('/lists');
      self.$eval();
    } else {
      $route.current.scope.params = $route.current.params;
      $window.scrollTo(0,0);
    }
  });

}, {$inject:['$route', '$location', '$window'], $eager: true});