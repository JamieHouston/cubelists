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
