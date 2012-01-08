var PORT = 8000;
var express = require('express');
var db = require("mysql-native").createTCPClient(); // localhost:3306 by default


var app = express.createServer();

 app.get('/list/:title', function(req, res){
 	 function addList(title){
	db.auto_prepare = true;
	function dump_rows(cmd)
	{
	   cmd.addListener('row', function(r) { console.dir(r); } );
	}

	db.auth("TagList", "root", "sa");
	dump_rows(db.execute("insert into List (title) VALUES ('test1');"));
	db.close();
 }

 	addList(req.params.title);
    res.send('List Created:  ' + req.params.title);
});

 app.listen(PORT);

