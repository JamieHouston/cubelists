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
app.get('/api/:cubeType', function(req, res) {
    dao.getCubes({cubeType: req.params.cubeType}, function(cubes){
       res.send(cubes); 
    });
});

// get a single cube and it's children
app.get('/api/:cubeType/:keyName', function(req, res) {
    dao.getCube({keyName: req.params.keyName, cubeType: req.params.cubeType}, function(cube){
        dao.getCubes({keyName: cube.parentKey, cubeType: req.params.cubeType}, function(cubes){
            cube.cubes = cubes;
            res.send(cube);
        });
    });
});

// save a cube
app.post('/api/:cubeType', function(req, res){
    dao.saveCube({cubeType: req.params.cubeType, cube: req.body});

    // send it back
    res.send(req.body);
});

// save a cube
app.delete('/api/:cubeType', function(req, res){
    dao.deleteCube({cubeType: req.params.cubeType, cube: req.body});

    // send it back
    res.send(req.body);
});

app.listen(8000);

// api:
// api/:cubeType - get all top level cubes of that type (such as lists/types/etc)
// api/:cubeType/:keyName - get the cube with that type and key, and it's children


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