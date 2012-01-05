var PORT = 8000;
var express = require('node_modules/express/lib/express');
var journey = require('node_modules/journey/lib/journey');
var tds = require('node_modules/tds/lib/tds');
var mssql = require('node_modules/node-mssql/lib/mssql');
//var db = require('node_modules/tsqlftw').tsqlftw;

var router = new(journey.Router);

getLists2();

// Create the routing table
router.map(function () {
    this.root.bind(function (req, res) { res.send("Welcome") });
    this.get(/^trolls\/([0-9]+)$/).bind(function (req, res, id) {
        database('trolls').get(id, function (doc) {
            res.send(200, {}, doc);
        });
    });
    this.post('/trolls').bind(function (req, res, data) {
        sys.puts(data.type); // "Cave-Troll"
        res.send(200);
    });
});

require('http').createServer(function (request, response) {
    var body = "";

    request.addListener('data', function (chunk) { body += chunk });
    request.addListener('end', function () {
        //
        // Dispatch the request to the router
        //
        router.handle(request, body, function (result) {
            response.writeHead(result.status, result.headers);
            response.end(result.body);
        });
    });
}).listen(PORT);

/*
var app = express.createServer();

 app.get('/', function(req, res){
   res.send('Hello World');
 });

 app.listen(PORT);
 */

 function getLists3(){
var mssql = new db();

mssql.connect('Server=localhost;Initial Catalog=Intellagent_1006D;User Id=Intellagent_demo;Password=intellagent_demo;', function (err, data) {
    mssql.query('select * from TagList', function (err, results) {
	    console.log(err);
		console.log(results);
		results = JSON.parse(results);
		console.log(results.count);
		// result set is in results.rows and has a row number.
		mssql.close(function (err, results) {
		       console.log('Connection closed.');
		});
    });
});
 }

function getLists2(){
	var connectionString = {'Server':'localhost','Port':'1433','Database':'TagList','User Id':'Intellagent_demo','Password':'intellagent_demo'};
	var context = new mssql.SqlConnection(connectionString, function(){
   var result = this.Execute("SELECT * FROM List;");
});
}

function getLists(){
 	var conn = new tds.Connection({
	  host: '127.0.0.1',
	  port: 1433,
	  userName: 'Intellagent_demo',
	  password: 'intellagent_demo',
	  database: 'TagList'
	})


	conn.connect(function(error) {
	  if (error != null) {
	    console.error('Received error', error);
	  } else {
	    console.log('Now connected, can start using');
	  }
	});

	conn.on('error', function(error) {
	  console.error('Received error', error);
	});

	conn.on('message', function(message) {
	  console.info('Received info', message);
	});

	var stmt = conn.createStatement('SELECT * FROM List');

	stmt.on('row', function(row) {
	  console.log('Received row: ', row.getValue(0));
	});

	stmt.execute();


	conn.end();

 }