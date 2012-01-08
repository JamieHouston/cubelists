var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/taglist');

var Schema = mongoose.Schema;

var TagList = new Schema({
    createdBy   : [TagUser]
  , key         : String
  , title       : String
  , body        : String
  , createDate  : {type: Date, default: Date.now}
  , updateDate  : Date
});

var TagItem = new Schema({
    createdBy   : [TagUser]
  , tagList     : [TagList]
  , title       : String
  , details     : String
  , createDate  : {type: Date, default: Date.now}
  , updateDate  : Date
  , complete    : {type: Boolean, default: false}
});

var TagUser = new Schema({
	  userName: String
  , email: { type: String, required: true, index: { unique: true, sparse: true } }
});


/**
 * Methods
 */

TagList.methods.findCreator = function (callback) {
  return this.db.model('Person').findById(this.createdBy, callback);
}

TagList.statics.findByKey = function (key, callback) {
  return this.find({ key: key }, callback);
}

TagList.methods.expressiveQuery = function (createdBy, date, callback) {
  return this.find('createdBy', creator).where('createDate').gte(date).run(callback);
}

/**
 * Define model.
 */

mongoose.model('TagList', TagList);
mongoose.model('TagUser', TagUser);