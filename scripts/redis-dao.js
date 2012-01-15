var redis = require("redis");

var client = redis.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});

function getChildren(parentKey, callback){
    console.log('getting children of ' + parentKey);

    client.hgetall(parentKey, function(err, reply){
        var cubes = [];
        for (key in reply){
            cubes.push({
                keyName: key,
                value: reply[key],
                parentKey: parentKey
            });
        }
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

function saveCube(cubeType, cube, callback){

	// add the cube values to one key
    // TODO: figure out how to do this in one call, or queue them and submit at once?
    Object.keys(cube).forEach(function (parameter) {
        console.log('setting ' + cube.keyName + ' : ' + parameter + ' = ' + cube[parameter]);
        client.hset(cube.keyName, parameter, cube[parameter]);
    });

    
    // add the cube key to it's parent
    var parentKey = cubeType + ':' + ((cube.parentKey && cube.parentKey.length)
    	? cube.parentKey
    	: 'master');
    client.hset(parentKey, cube.keyName, cube.value);

    callback && callback(list);

}

exports.setup = function(){
	getChildren('type:master', function(data){
		if (data && data.length) return;

        console.log('found no previous settings.  creating system types');

        var cube = {
            value: 'string',
            keyName: 'string',
            cubeType: 'system',
            parentKey: 'master'
        };

        saveCube('type', cube);

        cube.keyName = 'date';
        cube.value = 'date';
        saveCube('type', cube);

        cube.keyName = 'bool';
        cube.value = 'checkbox';
        saveCube('type', cube);
	});
}

exports.getCube = function(params, callback){
    var keyName = params.keyName;
	getCube(keyName, callback);
}

exports.getCubes = function(params, callback){
    var keyName = ((params.keyName && params.keyName.length)
        ? params.keyName
        : 'master');
    var cubeType =  ((params.cubeType && params.cubeType.length)
        ? params.cubeType
        : 'list');

	getChildren(cubeType + ':' + keyName, callback);
}

exports.saveCube = function(params, callback){
    var cubeType = params.cubeType;
    var cube = params.cube;
    saveCube(cubeType, cube, callback);
}