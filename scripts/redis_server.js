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

// get all of the parent cubes
app.get('/api/cubes', function(req, res) {
    console.log('service cubes');
    client.lrange('parentKey:master', 0, -1, function(err, reply){
        console.log('got it: ' + reply);
        if (reply){
            var cubes = reply
            res.send(cubes);
        }
    });
});

// get a single cube
app.get('/api/cubes/:keyName', function(req, res) {
    var keyName = req.params.keyName;
    console.log('grabbing cube ' + keyName);
    client.get(keyName, function(err, reply){
        console.log('got it: ' + reply)
        var cube = JSON.parse(reply);
        res.send(cube);
    });
});

// save a cube
app.post('/api/cubes', function(req, res){
    console.log('creating cube');
    console.log(req.body);
    //console.log(req.params);
    //console.log(req.param);
    //client.rpush('parentKey:master', req.body.keyName, redis.print);
    client.rpush('parentKey:master', JSON.stringify(req.body), redis.print);
    //client.set(req.body.keyName, JSON.stringify(req.body), redis.print);
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