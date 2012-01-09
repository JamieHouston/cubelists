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
    self.newTodo = "";
	self.editTodoStartContent = "";

    self.addTodo = function() {
        if (self.newTodo.length === 0) return;
        
        self.todos.push({
            content: self.newTodo,
            done: false,
            editing: false
        });
		persistencejs.add(self.newTodo);
        self.newTodo = "";
    };

    self.editTodo = function(todo) {
        angular.forEach(self.todos, function(value) {
            value.editing = false;
        });
        todo.editing = true;
		self.editTodoStartContent = todo.content;
    };

	self.changeStatus = function(todo){
		persistencejs.changeStatus(todo);
	};
	
    self.finishEditing = function(todo) {
        todo.editing = false;
		persistencejs.edit(self.editTodoStartContent, todo.content);
    };

    self.removeTodo = function(todo) {
        angular.Array.remove(self.todos, todo);
		persistencejs.remove(todo);
    };

    self.todos = [];

    var countTodos = function(done) {
        return function() {
            return angular.Array.count(self.todos, function(x) {
                return x.done === (done === "done");
            });
        }
    };

    self.remainingTodos = countTodos("undone");

    self.finishedTodos = countTodos("done");

    self.clearCompletedItems = function() {
        var oldTodos = self.todos;
        self.todos = [];
        angular.forEach(oldTodos, function(todo) {
            if (!todo.done) self.todos.push(todo);
        });
		persistencejs.clearCompletedItems();
    };

    self.hasFinishedTodos = function() {
        return self.finishedTodos() > 0;
    };

    self.hasTodos = function() {
        return self.todos.length > 0;
    };
	
	self.loadTodos = function(){
		persistencejs.fetchAll(self);
	}
	
	self.refresh = function(){ self.$apply(); }

	self.loadTodos();
};

TodoController.$inject = ['persistencejs'];