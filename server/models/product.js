// This is the friend.js file located at /server/models/friend.js
// We want to create a file that has the schema for our friends and creates a model that we can then call upon in our controller
var mongoose = require('mongoose');
// create our friendSchema
var Schema = mongoose.Schema;

var productSchema = new mongoose.Schema({
	// client: Object, 
	_order: {type: Schema.ObjectId, ref: 'Order'},
	_confectioner: {type: Schema.ObjectId, ref: 'Vendor'},
	reviews:[{type: Schema.Types.ObjectId, ref: "Review"}], 
	comments:[{type: Schema.Types.ObjectId, ref: "Comment"}], 
	product: String,
	description: String,
	serving: String,
	ingredients: String,
	price: Number,
	url: {type: String, default: './static/css/plate.png'},
	dateCreated: {type: Date, default: new Date},
	dateUpdated: {type: Date, default: new Date}
});
// use the schema to create the model
// Note that creating a model CREATES the collection in the database (makes the collection plural)
mongoose.model('Product', productSchema);
// notice that we aren't exporting anything -- this is because this file will be run when we require it using our config file and then since the model is defined we'll be able to access it from our controller