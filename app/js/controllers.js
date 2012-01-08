/* App Controllers */


function ListController(List, $xhr) {
	var self = this;
 
 	this.lists = List.query();

 	this.addList = function(){
 		var list = {Title: this.listTitle};
 		this.lists.push(list);

 		$xhr('POST','api2/list',list);
 		//List.save({Title: list.Title});
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