/* App Controllers */


function ListController(List) {
	var self = this;
 
 	this.lists = List.query();

 	this.addList = function(){
 		var list = {Title: this.listTitle};
 		this.lists.push(list);
 		List.save({title: this.listTitle});
 		this.listTitle = '';
 	};
}

function ListDetails(List){
	this.list = List.get({listId: this.params.listId});

 	this.addItem = function(){
 		this.list.Items.push({Title: this.itemTitle});

 		this.itemTitle = '';
 	};
}

function ConfigController() {
}

function ChildController (persistencejs){
    var self = this;

    self.key = this.params.key;

    self.load = function(){
        self.cube = persistencejs.get(self);
    }

    self.load();
}

function CubeController (persistencejs){
    var self = this;

    self.addCube = function(){
        if (self.newValue.length){
            var cube = {
                value: self.newValue,
                key: generateKey()
            };
        
            self.items.push(cube);
            persistencejs.add(cube);
            self.newValue = "";
        }
    }

    self.loadItems = function(){
        persistencejs.fetchAll(self);
    }
    
    self.refresh = function(){
        //self.$apply(); 
        // doesn't seem to do anything...?
     }

    self.newValue = "";
    self.items = [];
    self.loadItems();
}

function TodoController (persistencejs) {
    var self = this;
    var keyname = self.params.keyname;

    self.newTitle = "";

    self.addItem = function(){
        if (self.newTitle.length){
            var newItem = {
                title: self.newTitle,
                key: generateKey()
            };
        
            self.items.push(newItem);
            persistencejs.add(self.newTitle);
            self.newTitle = "";
        }
    }

    self.items = [];

    self.loadItems = function(){
        persistencejs.fetchAll(self);
    }

    self.loadParentList = function(){
        persistencejs.get(self);
    }
    
    self.refresh = function(){ self.$apply(); }

    if (self.keyname && self.keyname.length){
        self.loadParentList();
    } else {
        self.loadItems();
    }

};

CubeController.$inject = ['persistencejs'];
TodoController.$inject = ['persistencejs'];

function generateKey(){
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