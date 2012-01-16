angular.service('Api', function($resource){
  
    return $resource('api/:keyName', {keyName: ''},
        {create: {method: 'GET', url:'api/create'}}
    );
});

angular.service('cubesApp', function($route, $location, $window) {

  $route.when('/system', {template: 'partials/cubes.html', controller: SystemController});
  $route.when('/lists', {template: 'partials/list.html', controller: ListController});
  $route.when('/lists/:parentKey', {template: 'partials/list.html', controller: ListController});
  $route.when('/types', {template: 'partials/config.html', controller: ConfigController});
  $route.when('/types/:parentKey', {template: 'partials/config.html', controller: ConfigController});
  $route.when('/:parentKey', {template: 'partials/list.html', controller: ListController});

  var self = this;

  $route.onChange(function() {
    if ($location.hash === '') {
      $location.updateHash('/system');
      self.$eval();
    } else {
      $route.current.scope.params = $route.current.params;
      $window.scrollTo(0,0);
    }
  });

}, {$inject:['$route', '$location', '$window'], $eager: true});