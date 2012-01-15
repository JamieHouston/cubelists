#! /usr/bin/env node

var express = require('express');
var dao = require('./redis-dao');

var app = module.exports = express.createServer();

var staticPath = __dirname.replace('scripts','app');
console.log(staticPath);

app.use(express.static(staticPath));
app.use(express.bodyParser());

dao.setup();

// get all of the parent cubes
app.get('/api/cubes', function(req, res) {
    dao.getLists(function(lists){
       res.send(lists); 
    });
});

// get a single cube
app.get('/api/cubes/:keyName', function(req, res) {
    var keyName = req.params.keyName;
    dao.getList(keyName, function(list){
        dao.getCubes(keyName, function(cubes){
            list.cubes = cubes;
            res.send(list); 
        });
    });
});

// get a single cube
app.get('/api/cubes/:cubeType/:keyName', function(req, res) {
    var keyName = req.params.keyName;
    var cubeType = req.params.cubeType;
    dao.getList(keyName, function(list){
        dao.getCubes(keyName, function(cubes){
            list.cubes = cubes;
            res.send(list); 
        });
    });
});

// save a cube
app.post('/api/cubes', function(req, res){
    dao.saveList(req.body);

    // send it back
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
// simple: an email address

// keyName: type:1
// parentKey: type:master
// cubeType: type:string
// value: email

/////////////////////
// 
// more complex: a grocery list

// keyName: type:1
// parentKey: type:master
// cubeType: type:string
// value: to buy

// keyName: type:2
// parentKey: instance: master
// cubeType: list:1
// value: grocery list

// keyName: instance:3
// parentKey: instance:master
// cubeType: type:1
// value: cheese

// keyName: instance:4
// parentKey: instance:master
// cubeType: type:1
// value: butter