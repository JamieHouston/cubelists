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

function getCube(keyName, callback){
	console.log('grabbing cube ' + keyName);
    client.hgetall(keyName, function(err, reply){
        console.log('got it: ' + reply)
        callback && callback(reply);
    });
}

function saveCube(entityType, cube, callback){
    var redisKey = entityType + ':' + cube.keyName;
	
	// add the cube values to one key
    // TODO: figure out how to do this in one call, or queue them and submit at once?
    Object.keys(cube).forEach(function (parameter) {
        console.log('setting ' + cube.keyName + ' : ' + parameter + ' = ' + cube[parameter]);
        client.hset(cube.keyName, parameter, cube[parameter]);
    });

    
    // add the cube key to it's parent
    var parentKey = entityType + ':' + ((cube.parentKey && cube.parentKey.length)
    	? cube.parentKey
    	: 'master');
    client.hset(parentKey, cube.keyName, cube.value);

    callback && callback(list);

}

exports.setup = function(){
	getChildren('type:master', function(data){
		if (data && data.length) return;

        var cube = {
            value: 'string',
            keyName: 'system:string',
            cubeType: 'system',
            parentKey: 'master'
        };
        saveCube('type', cube);

        cube.keyName = 'system:date';
        cube.value = 'date';
        saveCube('type', cube);

        cube.keyName = 'system.bool';
        cube.value = 'checkbox';
        saveCube('type', cube);
	});
}

exports.getLists = function(callback){
    getChildren('list:master', callback);
}

exports.getList = function(keyName, callback){
	getCube(keyName, callback);
}

exports.getCubes = function(keyName, callback){
	getChildren('list:' + keyName, callback);
}

exports.saveList = function(list, callback){
	saveCube('list', cube, callback);
}