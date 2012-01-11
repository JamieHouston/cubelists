/* http://docs.angularjs.org/#!angular.service */

/**
 * App service which is responsible for the main configuration of the app.
 */
angular.service('List', function($resource) {
 return $resource('http://localhost:8001/list/:listId', {}, {
   query: {method: 'GET', params: {listId: ''}, isArray: true}
 });
});

angular.service('persistencejs', function() {
  persistence.store.websql.config(persistence, 'anytag', 'cube database', 5*1024*1024);

  var Cube = persistence.define('Cube', {
    value: 'TEXT',
    key: 'TEXT'
  });

  persistence.schemaSync();
  return {
    add: function(newCube){
      var cube = new Cube();
      cube.value = newCube.value;
      cube.key = newCube.key;
      persistence.add(cube);
      persistence.flush();
    },

    get: function(controller){
      Cube.findBy('key', controller.key, function(err, result){
        controller.cube = result;
      });
    },

    fetchAll: function(controller){
      Cube.all().list(function(results){
        var itemCount = results.length;
        var cubes = [];
        results.forEach(function(item){
          cubes.push({
            value: item.value,
            key: item.key
          });
          if(--itemCount == 0){
            controller.items = cubes;
            controller.refresh();
          }
        });
      });
    }
  };
});


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