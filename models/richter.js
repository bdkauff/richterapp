var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// define a new schema
var richterSchema = new Schema({
	pageTitle : String, // should convey the type of paintings
	photographs : [String] // array of URL's


});
module.exports = mongoose.model('Richter',richterSchema);