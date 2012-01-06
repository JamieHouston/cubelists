var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

TagListProvider = function(host, port) {
  this.db= new Db('node-mongo-taglist', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};

//getCollection

TagListProvider.prototype.getCollection= function(callback) {
  this.db.collection('lists', function(error, taglist_collection) {
    if( error ) callback(error);
    else callback(null, taglist_collection);
  });
};

//findAll
TagListProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, taglist_collection) {
      if( error ) callback(error)
      else {
        taglist_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

//findById

TagListProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, taglist_collection) {
      if( error ) callback(error)
      else {
        taglist_collection.findOne({_id: taglist_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

//save
TagListProvider.prototype.save = function(taglists, callback) {
    this.getCollection(function(error, taglist_collection) {
      if( error ) callback(error)
      else {
        if( typeof(taglists.length)=="undefined")
          taglists = [taglists];

        for( var i =0;i< taglists.length;i++ ) {
          taglist = taglists[i];
          taglist.created_at = new Date();
          if( taglist.comments === undefined ) taglist.comments = [];
          for(var j =0;j< taglist.comments.length; j++) {
            taglist.comments[j].created_at = new Date();
          }
        }

        taglist_collection.insert(taglists, function() {
          callback(null, taglists);
        });
      }
    });
};

exports.TagListProvider = TagListProvider;