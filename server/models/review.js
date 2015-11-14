var mongoose = require('mongoose');
// create our friendSchema
var Schema = mongoose.Schema;

var ReviewSchema = new mongoose.Schema({
  // client: Object, 
  _item: {type: Schema.ObjectId, ref: 'Product'},
  _user: {type: Schema.ObjectId, ref: 'User'},
  rating: Number,
  review: String,
  likes: [{type: Schema.ObjectId, ref: 'User'}],
  dateCreated: {type: Date, default: new Date},
  dateUpdated: {type: Date, default: new Date}
});
// use the schema to create the model
// Note that creating a model CREATES the collection in the database (makes the collection plural)
mongoose.model('Review', ReviewSchema);
// notice that we aren't exporting anything -- this is because this file will be run when we require it using our config file and then since the model is defined we'll be able to access it from our controller