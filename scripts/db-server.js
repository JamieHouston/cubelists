var db = require("mysql-native").createTCPClient(); // localhost:3306 by default

mysqltest();


 function mysqltest(){
	db.auto_prepare = true;
	function dump_rows(cmd)
	{
	   cmd.addListener('row', function(r) { console.dir(r); } );
	}

	db.auth("taglist", "root", "sa");
	dump_rows(db.query("select * from users"));
	dump_rows(db.execute("select 1+1,2,3,'4',length(?)", ["hello"]));
	db.close();
 }