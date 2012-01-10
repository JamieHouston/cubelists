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

function TodoController (persistencejs) {
    var self = this;
    var keyname = self.params.keyname;

    self.newTitle = "";

    self.addItem = function(){
        if (self.newTitle.length){
            var newItem = {title: self.newTitle}
        
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

TodoController.$inject = ['persistencejs'];