var redis = require("redis");

var client = redis.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});

function getChildren(parentKey, callback){
    client.hgetall(parentKey, function(err, reply){
        console.log(reply);
        var cubes = [];
        for (key in reply){
            cubes.push({
                keyName: key,
                value: reply[key],
                parentKey: parentKey
            });
        }
        console.log('cubes are :' + cubes);
        callback && callback(cubes);
    });
}

exports.getLists = function(callback){
    getChildren('list:master', callback);
}

exports.getList = function(keyName, callback){
    console.log('grabbing cube ' + keyName);
    client.hgetall(keyName, function(err, reply){
        console.log('got it: ' + reply)
        callback && callback(reply);
    });
}

exports.getCubes = function(keyName, callback){
	getChildren(keyName, callback);
}

exports.saveList = function(list, callback){
    var redisKey = 'list:' + list.keyName;
    
    // add the cube values to one key
    // TODO: figure out how to do this in one call, or queue them and submit at once?
    Object.keys(list).forEach(function (parameter) {
        console.log('setting ' + list.keyName + ' : ' + parameter + ' = ' + list[parameter]);
        client.hset(list.keyName, parameter, list[parameter]);
    });
    
    // add the cube key to it's parent
    client.hset('list:master', list.keyName, list.value);

    callback && callback(list);
}