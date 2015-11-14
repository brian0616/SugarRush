var mongoose = require('mongoose');
// require('../models/customer');
var Vendor = mongoose.model('Vendor');
var Product = mongoose.model('Product');
var Order = mongoose.model('Order');
var User = mongoose.model('User');

module.exports = (function() {
	return {
		login: function(req, res){
			console.log(req.body);
			Vendor.findOne({email: req.body.email}, function(err, result){
				if(err){
					console.log('error with seller login');
				} else {
					res.json(result);
				}
			})
		},

		grabOrders: function(req, res){
			console.log(req.query.id);
			Vendor.findOne({_id: req.query.id})
			.populate('orders')
			.exec(function(err, vendor){
				console.log("here population");

	  			Vendor.populate(vendor, 
	  				{path: 'orders.item',
		      		model: 'Product'}, 
		      		function (err, result) {
	     			});

	    		Vendor.populate(vendor, 	  				
	    			{path: 'orders._user',
		      		model: 'User'}, 
		      		function (err, result) {
	     	 		res.json(result);
	    		});
   
			})
		}


}})();