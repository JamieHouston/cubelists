var PORT = 8001;

var connect = require('connect');

var appSchema = require('./mongo-dao.js');

var restServer = connect.createServer(
	connect.bodyParser(),
	connect.router(function(restApp) {

		function responseHandler(res, data) {
			var jsonData = JSON.stringify(data);
			res.writeHead(400, { 'Content-Type': 'application/json', 'Content-Length':jsonData.length ? jsonData.length : 0 });
    	    res.end(jsonData);
      	};

        restApp.get('/list/:id?', function(req, res) {
        	var query = {};
        	
        	if(req.params.id){
              query._id = req.params.id;
            }

            TagList.find(query, function(error, records) {
            	var output;
            	if(error){
               		output = {result : 'could not get record(s)', error : error};
              	}
              	else{
                output = records;
              }
              responseHandler(res, output);
            });
      	});


        restApp.post('/list', function(req, res) {
          	var list = new TagList(req.body);
          	list.save(function(error) {
              if(error){
              	responseHandler(res, {result : 'model save failed', error : error});
                return;
              }
              responseHandler(res, record);
            });
      	});
  	})
).listen(PORT);

// FROM http://errumm.github.com/NoMoBone-Tutorials/