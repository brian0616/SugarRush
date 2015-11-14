myApp.factory('factory', function($http){
	var factory = {};


//------------user factory----------//
  var users = [];
  var loginUser = {};
    factory.userList = function (callback){
          $http.get('/users').success(function (data) {
          callback(data);
        }) 
       }

    factory.userLogin = function(user, callback){
      console.log(user);
      $http.post('/user_login', user).success(function(output){
        callback(output);
      })
    }

    factory.register = function (userNew , callback){
      $http.post('/register', userNew).success(function(output){
          users = output;       
          callback(users);   
      });
    }

    factory.favoritesUser = function(user, callback){
      data = {user: user};
      console.log(data);
      $http.get('/favorites_user', {params : data}).success(function(output){
        callback(output);
      })  
    }

    factory.accountUser = function(user, callback){
      data = {user:user};
      console.log(data)
      $http.get('/infoUser', {params: data}).success(function(result){
        callback(result);
      })
    }

     factory.updateAcct = function(user, callback){
      data = {user:user};
      console.log(data)
      $http.post('/updateUser', data).success(function(result){
        callback(result);
      })
    }

      factory.updatePass = function(pass, callback){
      // data = {user:user};
      console.log(pass)
      $http.post('/updatePass', pass).success(function(result){
        callback(result);
      })
    }

      factory.listSave = function(user,list, callback){
      // data = {user:user};
      data={user: user, list: list}
      $http.post('/listSave', data).success(function(result){
        callback(result);
      })
    }


//-----------product factory--------------//
	var products = [];
  var chef_id = sessionStorage.getItem('chef_id');

	factory.inventory = function (chef_id, callback){
    // var seller_id = current_user._id;
		$http.get('/inventory/'+chef_id).success(function (data) {
			products = data;
			callback(products);
		}) 
	}
  factory.allInventory = function (callback){
        // pass the clients to a callback to be used by whoever calls the method
        $http.get('/allInventory').success(function (data) {
          products = data;
          callback(products);
        }) 
  }
  
  factory.productById = function (product_id, callback){
    $http.post('/infoProduct', {id: product_id}).success(function (data) {
      products = data;
      callback(products);
    }) 
  }

  factory.reviewsProduct = function(product_id, callback){
    $http.get('/reviewsProduct/'+product_id).success(function (data) {
      reviews = data;
      callback(reviews);
    }) 
  }

  factory.commentsProduct = function(product_id, callback){
    $http.get('/commentsProduct/'+product_id).success(function (data) {
      comments = data;
      callback(comments);
    }) 
  }

  factory.productReview = function(review, callback){
    $http.post('/productReview', {review}).success(function (data) {
      review = data;
      callback(products);
    }) 
  }

  factory.productComment = function(comment, callback){
    $http.post('/productComment', {comment}).success(function (data) {
      comment = data;
      callback(products);
    }) 
  }
  
  factory.prodFavorite = function(user, product, callback){
      var data = {
        user: user, 
        product: product
      }
     $http.post('/prodFavorite', data).success(function (data) {
        result = data;
        callback(result);
    }) 
  }


		// factory.productRemove = function(product, callback){
		// 	var data = product;
		// 	$http.post('/product_remove', data).success(function(output){
		// 		products = output;       
		// 		callback(products);   
		// 	});
		// }


//------------order factory------------//
  
  var cart = {};
  

    // factory.orderAdd = function(product, order){
    //   var item = {item: product, order: order}
    //   cart.push(item);
    //   console.log(cart);
    //   item = {};
    // }

    // factory.cart = function(){
    //   console.log("hello, lets check out");
    //   return cart;
    // }

    factory.checkout = function(user_id,cart){      
        // var order_list = [];
        console.log('now checkout');
        cart.user = user_id;
        // var cart_pending = [];
        var item_pending = {};
        // console.log(cart_checkout);
        // console.log(cart_checkout.cart);
        // console.log(cart_checkout.cart[0]);
        for(var i=0; i<cart.orders.length; i++){

          var item = {user: user_id, order: cart.orders[i]};
          console.log(item);
           $http.post('/orderCheckout', item).success(function(output){
              console.log(output);
              item.info_email = output;
              $http.post('/vendorNotify', item).success(function(output){

              })
              
           })             

          // $http.post('/vendorCheckoutTo', cart_item).success(function(output){              
          //     item_pending = output;      
          //     checkout = {user: loginUser._id, item: item_pending};
          //     console.log('here is a checkout');
          //     $http.post('/orderCheckout', checkout).success(function(output){
          //     });
          //     console.log("item has been checked out")
          // });       
        }
      } 


//------------seller factory-----------//
  var current_user;
  var orders = [];
  factory.chefLogin = function(chef, callback){
    $http.post('/chef_login', chef).success(function(output){
      if(output != null && chef.password == output.password){ //check if output is not empmty => if empty, need to register as a new user
        current_user = output;
        callback(output);
      } 
      else {
        var message = "Invalid patissier login";
        callback(message);
      }
    })  
  }

  factory.chefOrders = function (chef_id, callback){
        // pass the clients to a callback to be used by whoever calls the method
        $http.get('/sellerOrders', {params: {id: chef_id}}).success(function (data) {
            orders = data;
            callback(orders);
        }) 
    }

  factory.productAdd = function (info, callback){
      // info._confectioner = chef_id;
      console.log(info);
      $http.post('/product_add', info).success(function(output){
        callback(output);
      });
    }

  factory.editProduct = function(update_product_info){
    $http.post('/editProduct', {info: update_product_info});
  }

  factory.orderStatus = function(order){
    $http.post('/orderStatus', {order: order});
  }

  factory.uploadFile = function(fd, callback){
      $http.post('/imgUpload', fd, {
            withCredentials: true,
            headers: {'Content-Type': undefined },
            transformRequest: angular.identity
        }).success(function(output){
          // $location.path('/seller');
            success = output;
            callback(success);
        });
    }

	return factory;
})