var PORT = 8001;
var express = require('express');
var TagListProvider = require('./provider-mongodb').TagListProvider;

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

var tagListProvider = new TagListProvider('localhost', 27017);
// Routes

app.get('/', function(req, res){
    tagListProvider.findAll( function(error,docs){
        res.render(docs);
    });
});

app.post('/list/new', function(req, res){
    tagListProvider.save({
        title: req.param('title')
    }, function( error, docs) {
        res.redirect('/')
    });
});

app.get('/list/:id', function(req, res) {
    tagListProvider.findById(req.params.id, function(error, tagList) {
        res.render(tagList);
    });
});

app.post('/list/:id/item/new', function(req, res) {
    tagListProvider.addListItem(req.params.id, {
        title: req.param('title'),
        created_at: new Date()
       } , function( error, docs) {
           res.redirect('/list/' + req.params.id);
       });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);