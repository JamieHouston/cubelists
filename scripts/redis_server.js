#! /usr/bin/env node

var redis = require("redis"),
    client = redis.createClient();

var express = require('express');

var app = module.exports = express.createServer();


client.on("error", function (err) {
    console.log("Error " + err);
});

var staticPath = __dirname.replace('scripts','app');
console.log(staticPath);

app.use(express.static(staticPath));
app.use(express.bodyParser());

app.get('/api/cubes', function(req, res) {
    console.log('service cubes');
    var tempCubes = [];
    tempCubes.push({'keyName': '123', 'value': 'it works'});
    res.send(tempCubes);
});

app.post('/api/cubes', function(req, res){
    console.log('creating cube');
    console.log(req.body);
    //console.log(req.params);
    //console.log(req.param);
    client.set(req.body.keyName, req.body, redis.print);
   //client.set("string key", "string val", redis.print); 
   res.send(req.body);
});
app.listen(8000);

// disable layout
//app.set("view options", {layout: false});

// make a custom html template
/*
app.register('.html', {
	compile: function(str, options){
  		return function(locals){
    		return str;
  		};
	}
});
*/
// Routes
/*

/*
client.set("string key", "string val", redis.print);
client.hset("hash key", "hashtest 1", "some value", redis.print);
client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
client.hkeys("hash key", function (err, replies) {
    console.log(replies.length + " replies:");
    replies.forEach(function (reply, i) {
        console.log("    " + i + ": " + reply);
    });
    client.quit();
});
*/