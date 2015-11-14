// This is the friend.js file located at /server/models/friend.js
// We want to create a file that has the schema for our friends and creates a model that we can then call upon in our controller
var mongoose = require('mongoose');
// create our friendSchema
var Schema = mongoose.Schema;

var OrderSchema = new mongoose.Schema({
  // client: Object, 
  _user: {type: Schema.ObjectId, ref: 'User'},
  item: {type: Schema.Types.ObjectId, ref: 'Product'},
  quantity: Number,
  total: Number,
  comment: String,
  status: {type: String, default:"Pending"},
  dateOrdered: {type: Date, default: new Date},
  dateUpdated: {type: Date, default: new Date}
});
// use the schema to create the model
// Note that creating a model CREATES the collection in the database (makes the collection plural)
mongoose.model('Order', OrderSchema);
// notice that we aren't exporting anything -- this is because this file will be run when we require it using our config file and then since the model is defined we'll be able to access it from our controller