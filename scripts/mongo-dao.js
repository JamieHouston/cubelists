var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/cube');

var Schema = mongoose.Schema;

var Cube = new Schema({
    key         : String
  , value       : String
});

/**
 * Methods
 */

TagList.statics.findByKey = function (key, callback) {
  return this.find({ key: key }, callback);
}

/**
 * Define model.
 */

mongoose.model('Cube', Cube);