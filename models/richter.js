var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// define a new schema
var richterSchema = new Schema({
	photoURL : [String] // array of URL's



});
module.exports = mongoose.model('Richter',richterSchema);