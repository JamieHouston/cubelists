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
  persistence.store.websql.config(persistence, 'anytag', 'tagitem database', 5*1024*1024);

  var TagItem = persistence.define('TagItem', {
    title: 'TEXT',
    details: 'TEXT',
    complete: 'BOOL',
    keyname: 'TEXT',
    parentKeyname: 'TEXT'
  });

  persistence.schemaSync();
  return {
    add: function(title){
      var t = new TagItem();
      t.title = title;
      t.details = "test details";
      t.complete = false;
      t.keyname = getKeyname();
      t.parentKeyname = '';
      persistence.add(t);
      persistence.flush();
    },

    fetchAll: function(controller){
      TagItem.all().list(function(results){
        var itemCount = results.length;
        var items = [];
        results.forEach(function(item){
          items.push({
            title: item.title,
            complete: item.complete,
            keyname: item.keyname,
            details: item.details,
            parentKeyname: item.parentKeyname
          });
          if(--itemCount == 0){
            controller.items = items;
            controller.refresh();
          }
        });
      });
    },

    get: function(controller){
      var keyname = controller.keyname;
      var parent = TagItem.all().filter('id','=',keyname);
      var children = TagItem.all().filter('parentKeyname','=', keyname);
      list.children = children;
      controller.list = parent;
    }

    /*
    edit: function(startContent, endContent){
      Todo.all().filter('content','=',startContent).one(function(item){
        item.content = endContent;
        persistence.flush();
      });
    },
    
    changeStatus: function(item){
      Todo.all().filter('content','=',item.content).one(function(todo){
        todo.done = item.done;
        persistence.flush();
      });
    },
    
    clearCompletedItems: function(){
      Todo.all().filter('done','=',true).destroyAll();
    },
    
    remove: function(item){
      Todo.all().filter('content','=',item.content).destroyAll();
    },
    
    fetchAll: function(controller){
      Todo.all().list(function(items){
        var itemCount = items.length;
        var todos = [];
        items.forEach(function(item){
          todos.push({
            content: item.content,
            done: item.done,
            editing: false
          });
          if(--itemCount == 0){
            controller.todos = todos;
            controller.refresh();
          }
        });
      });
      */
  };
});


angular.service('myAngularApp', function($route, $location, $window) {

  $route.when('/lists', {template: 'partials/lists.html', controller: TodoController});
  $route.when('/config', {template: 'partials/config.html', controller: ConfigController});
  $route.when('/item/:keyname', {template: 'partials/listdetail.html', controller: TodoController});

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

function getKeyname(){
  var keyChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  var keyLength = 8;
  function randomString() {
      var results = '';
      for (var i=0; i<keyLength; i++){
          var randomPoz = Math.floor(Math.random() * keyChars.length);
          results += keyChars.substring(randomPoz, randomPoz+1);
      }
      return results;
  }
  return randomString();
}