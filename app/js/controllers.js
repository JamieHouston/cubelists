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
    
    self.refresh = function(){ self.$apply(); }

    self.loadItems();

};

TodoController.$inject = ['persistencejs'];