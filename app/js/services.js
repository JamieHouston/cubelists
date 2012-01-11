angular.service('myAngularApp', function($route, $location, $window) {

  $route.when('/cubes', {template: 'partials/cubes.html', controller: CubeController});
  $route.when('/config', {template: 'partials/config.html', controller: ConfigController});
  $route.when('/item/:key', {template: 'partials/cubechild.html', controller: ChildController});

  var self = this;

  $route.onChange(function() {
    if ($location.hash === '') {
      $location.updateHash('/cubes');
      self.$eval();
    } else {
      $route.current.scope.params = $route.current.params;
      $window.scrollTo(0,0);
    }
  });

}, {$inject:['$route', '$location', '$window'], $eager: true});