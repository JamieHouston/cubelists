#! /usr/bin/env node

var redis = require("redis"),
    client = redis.createClient();

var express = require('express');

var app = module.exports = express.createServer();

client.on("error", function (err) {
    console.log("Error " + err);
});

// disable layout
app.set("view options", {layout: false});

// make a custom html template
app.register('.html', {
	compile: function(str, options){
  		return function(locals){
    		return str;
  		};
	}
});

// Routes
app.get('/', function(req, res) {
    res.render('../app/index.html');
});

app.listen(8000);

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