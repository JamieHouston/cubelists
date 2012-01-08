/* http://docs.angularjs.org/#!angular.service */

/**
 * App service which is responsible for the main configuration of the app.
 */
angular.service('List', function($resource) {
 return $resource('http://localhost:8001/list/:listId', {}, {
   query: {method: 'GET', params: {listId: ''}, isArray: true}
 });
});

angular.services('Connect', function($resource){
  var id = 0;
  $xhr('GET', 'http://localhost:8002/join', { nick: 'taglist' }, function(code, response) {
    //handle the server's response to our nickname and join request
    id   = response.id;
  });


angular.service('myAngularApp', function($route, $location, $window) {

  $route.when('/lists', {template: 'partials/lists.html', controller: ListController});
  $route.when('/config', {template: 'partials/config.html', controller: ConfigController});
  $route.when('/list/:listId', {template: 'partials/listdetail.html', controller: ListDetails});

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

