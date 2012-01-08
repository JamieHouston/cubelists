var PORT = 8001;
var journey = require('journey');
var TagListProvider = require('./provider-mongodb').TagListProvider;

var router = new (journey.Router);

var tagListProvider = new TagListProvider('localhost', 27017);

// Routes
router.map(function(){
	this.root.bind(function (req, res){res.send(400, {}, "invalid")});
	this.get(/^list\/([\d]*)$/).bind(function(req, res, id){
		tagListProvider.findById(1, function(error, tagList) {
        	res.send(200, {}, tagList);
    	});
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