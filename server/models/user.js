// This is the friend.js file located at /server/models/friend.js
// We want to create a file that has the schema for our friends and creates a model that we can then call upon in our controller
var mongoose = require('mongoose'),
  	bcrypt = require('bcrypt-nodejs'),
    Schema = mongoose.Schema;

var userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: { 
  	type: String, 
  	match: [/.+\@.+\..+/, "Please fill a valid email address"]
	},
  password: {
		type: String,
		validate: [
			function(password) {
				return password && password.length > 6;
			}, 'Password should be longer'
		]
	},
  salt: String,
  phone: String,
  cart: [{type: Schema.ObjectId, ref: 'Order'}],
  favorites: [{type: Schema.ObjectId, ref: 'Product'}],
  orders: [{type: Schema.ObjectId, ref: 'Order'}],
  reviews: [{type: Schema.ObjectId, ref: 'Review'}],
  // comments: [{type: Schema.ObjectId, ref: 'Comment'}],
  dateCreated: {type: Date, default: new Date},
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// use the schema to create the model
// Note that creating a model CREATES the collection in the database (makes the collection plural)
mongoose.model('User', userSchema);
// notice that we aren't exporting anything -- this is because this file will be run when we require it using our config file and then since the model is defined we'll be able to access it from our controller