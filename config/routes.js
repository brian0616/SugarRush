var Product = require('../server/controllers/products.js');
var Order = require('../server/controllers/orders.js');
var User = require('../server/controllers/users.js');
var Vendor = require('../server/controllers/vendors.js');

module.exports = function(app, upload, passport, transporter){
	console.log(User);
	// app.post('/user_add', function(req, res){
	// 	User.userAdd(req, res);
	// })

	// app.post('/user_login', function(req, res){
	// 	User.userLogin(req, res);
	// })
	app.get('/infoUser', function(req, res){
		console.log('hi)');
		User.accountUser(req, res);
	})

 	app.post('/chef_login', function(req, res){
		Vendor.login(req, res);
	})	

	app.post('/register', function(req,res,next){
		passport.authenticate('local-signup', function(err, user, info) {
    	if (err) { return next(err) }
    	if (!user) {
      // *** Display message using Express 3 locals
      	console.log(info.message);
       	return res.json({message: info.message});
    	}
    	req.logIn(user, function(err) {
    	console.log(user);
    	console.log(req.user);
      	if (err) { return next(err); }
      	return res.json(req.user);
    	});
  		})(req, res, next);

	});

	app.post('/user_login', function(req, res, next) {
  	passport.authenticate('local-login', function(err, user, info) {
    	if (err) { return next(err) }
    	if (!user) {
       	return res.json({message: info.message});
    	}
    	req.logIn(user, function(err) {
      	if (err) { return next(err); }
      	return res.json(req.user);
    	});
  		})(req, res, next);
	});

	app.post('/updatePass', function(req,res,next){
		passport.authenticate('local-password', function(err, user, info) {
    	if (err) { return next(err) }
    	if (!user) {
      // *** Display message using Express 3 locals
      	console.log(info.message);
       	return res.json({message: info.message});
    	}
    	req.logIn(user, function(err) {
    	console.log(user);
    	console.log(req.user);
      	if (err) { return next(err); }
      	return res.json(req.user);
    	});
  		})(req, res, next);

	});

	app.post('/updateUser', function(req, res){
		User.updateUser(req, res);
	})	

	app.post('/orderCheckout', function(req,res){
	  	Order.orderCheckout(req,res);
	})

	app.post('/vendorNotify', function(req,res){
		console.log('email vendor');
		console.log(req.body);
	  	var order_item = req.body.order.item;
	  	var order_info = req.body.order.info;
	  	var vendor_email = req.body.info_email.vendor_email;
	  	var user = req.body.info_email.user;
	  	msg = user.first_name + ' ' + user.last_name; 
	  	msg += ' has ordered ' + order_info.quantity +' '+ order_item.product +'(s)';
        msg += '\n' + order_info.comment 
         transporter.sendMail(
         {from: 'sugarrush.effect@gmail.com',
          to: vendor_email,
          subject: 'New Orders',
          text: msg
         });
	})

	app.post('/orderStatus', function(req, res){
		Order.orderStatus(req, res);
		// console.log('order status');
		// console.log(req.body);
		// order = req.body.order;
		// if(order.status == 'Ready'){
		// 	msg = 'Your order of ' + order.quantity +' '+ order.item.product + '(s)';
  //       	msg += ' has been updated to: ';
  //       	msg += order.status;
  //       	msg += '. Please arrange with the vendor to pick up your order.';
	 //         transporter.sendMail(
	 //         {from: 'sugarrush.effect@gmail.com',
	 //          to: res.vendor_emal,
	 //          subject: 'Order Update',
	 //          text: msg
	 //         });
		// }
	})

	app.get('/favorites_user', function(req,res){
		Product.favoritesUser(req,res);
	})

	app.post('/listSave', function(req,res){
		User.listSave_user(req,res);
	})

	app.get('/inventory/:id', function(req, res){
		Product.inventory(req, res);
	})

	app.get('/allInventory', function(req, res){
		Product.allInventory(req, res);
	})

	app.post('/product_add', function(req, res){
		Product.productAdd(req, res);
	})
	app.post('/infoProduct', function(req, res){
		Product.infoProduct(req, res);
	})

	app.get('/reviewsProduct/:id', function(req,res){
		Product.reviewsProduct(req,res);
	})

	app.get('/commentsProduct/:id', function(req,res){
		Product.commentsProduct(req,res);
	})

	app.post('/prodFavorite', function(req,res){
		Product.prodFavorite(req,res);
	})

	app.post('/editProduct', function(req, res){
		Product.editProduct(req, res);
	})
	app.post('/imgUpload', upload.single('file'), function (req, res, next) {
		Product.updateUrl(req, res);
	})

	app.post('/productReview', function(req,res){
		Product.productReview(req,res);
	})

	app.post('/productComment', function(req,res){
		Product.productComment(req,res);
	})

	app.get('/sellerOrders', function(req, res){
		Vendor.grabOrders(req, res);
	})



		// app.post('/imgUpload', upload.single('pic'), function(req, res){
	// 	// console.log(req.body);
	// 	// console.log(req.file);
	// 	// res.status(204).end();
	// });
}