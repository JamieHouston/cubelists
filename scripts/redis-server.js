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
    //client.lrange('parentKey:master', 0, -1, function(err, reply){
        client.get('value:master:' + req.param.keyName, function(err, reply){
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
    var values = [];

    Object.keys(req.body).forEach(function (parameter) {
        var redisKey = 'key:' + req.body.keyName;
        console.log('setting ' + redisKey + ' : ' + parameter + ' = ' + req.body[parameter]);
        client.hset(redisKey, parameter, req.body[parameter]);
    });

    console.log(values);
   res.send(req.body);
});
app.listen(8000);



// organization:

// cubes are either instances or types
// prefix of keyName determines what a cube is
// instance: or type:

// master is top level cube... everything needs one
// instance:master and type:master

// properties of cubes
// keyName: unique key for this cube
// parentKey: the container for this cube
// cubeType: keyName of cube defining the type (an instance refers to a type, a type refers to another type or predefined definition like string)
// value: the value of the cube... depending on what the cube is, this could be the type name or cube value

// cubeType can be a list of a type, or a type. (such as a list of strings or string)

// examples:

/////////////////////
// an email address

// keyName: type:123
// parentKey: type:master
// cubeType: type:string
// cubeValue: email

/////////////////////
// 
// a grocery list