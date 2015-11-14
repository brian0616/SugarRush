myApp.controller('storeController', function($scope, $location, $routeParams, $cookies, factory){
	$scope.products = [];
  $scope.goto_product = {};
 	$scope.show_formReview = false;
  $scope.show_formComment = false;
 	$scope.btn_review='Review';
  $scope.btn_comment='Comment';
  $scope.productLocation;
  $scope.user = JSON.parse(sessionStorage.getItem('user'));
  

  var user_id = sessionStorage.getItem('user_id');          
	var product_id = $routeParams.id;

  if(!user_id){
    $location.path('#/')
  }

	$scope.cart = $cookies.getObject(user_id);  
	console.log($scope.cart);
	if(!$scope.cart){
		$scope.cart = {orders:[]};
	}
	if ($routeParams.id){
		factory.productById(product_id, function(result){
			$scope.goto_product = result;
			// console.log($scope.goto_product);

		factory.reviewsProduct(product_id, function(review_result){
			$scope.itemReviews = review_result;
			// console.log($scope.itemReviews);
		})

    factory.commentsProduct(product_id, function(comment_result){
      $scope.itemComments = comment_result;
      // console.log($scope.itemComments);
    })

  
	


			$scope.mapOptions = {
			    zoom: 15,
			    center: new google.maps.LatLng(41.923, 12.513),
			    mapTypeId: google.maps.MapTypeId.ROADMAP
			}
			$scope.map = new google.maps.Map(document.getElementById('map'), $scope.mapOptions); 
			
			var cities = $scope.goto_product._confectioner.address;
			var geocoder= new google.maps.Geocoder();

			 var createMarker = function (info){
			    var marker = new google.maps.Marker({
			        map: $scope.map,
			        icon:'/static/css/blueball.png',
			        animation: google.maps.Animation.DROP,
			        position: new google.maps.LatLng(info.lat(), info.lng())
			    });
			 }

			geocoder.geocode( { 'address': cities }, function(results, status) {
			 if (status == google.maps.GeocoderStatus.OK) {
			    newAddress = results[0].geometry.location;
			    $scope.map.setCenter(newAddress);
			    createMarker(newAddress);
			 }
	     })
	  })

	} else {
		factory.allInventory(function(data){
			$scope.products = data;
		})

    factory.favoritesUser(user_id,function(data){
      console.log(data);
      $scope.favorites = data[0].favorites;
    })

	}

	$scope.orderAdd = function (product, orderinfo){
 		 if(!orderinfo || !orderinfo.quantity){
 		 	alert("You must have a quantity!");
 		 } else {
 			  orderinfo.total = product.price * orderinfo.quantity;
          	console.log("cart");
          	var item= {
              product: product.product,
              price: product.price,
          		_id: product._id,
              _confectioner: product._confectioner._id
          	}; 
         	  var order = {item: item, info:orderinfo}
            console.log(order);
          	// console.log($scope.cart);
          	$scope.cart.orders.push(order);
          	$cookies.putObject(user_id, $scope.cart);
           // factory.orderAdd(product, order);

          // clear the form values
          $scope.orderinfo = {};
          // var checkout = confirm("Your order has been added to the cart! Go to checkout?");
          // if (checkout){
          // 	$location.path('#/checkout');
          // } else{
          // 	$location.path('#/buyer');
          // }
           // factory.getOrders(function(data){
           //    $scope.orders = data;
           //  }); 
 		   }
     }

    $scope.checkout = function(){
          factory.checkout(user_id,$scope.cart);
          var cart = {orders:[]}
          $cookies.putObject(user_id,cart);  
          $scope.cart = $cookies.getObject(user_id);  
        }

    $scope.orderEdit = function($index){
        $scope.orderIndex = $index
    }

    $scope.orderUpdate = function(){
        $cookies.putObject(user_id, $scope.cart);
        $scope.cart = $cookies.getObject(user_id);  
    }

    $scope.rmOrder = function(index){
        var dltOrder = confirm('Remove order?');
        if(dltOrder){
          $scope.cart.orders.splice(index,1);
          $cookies.putObject(user_id, $scope.cart);
          $scope.cart = $cookies.getObject(user_id);
          $('#order_edit').modal('hide');
          alert('Your order has been deleted!'); 
        } 
    }

    $scope.prodFavorite = function(product){
        console.log(product);
        factory.prodFavorite(user_id, product, function(data){
          alert(data.message);
        })
    }

    $scope.productReview = function(product,review){
        if(!review || !review.review){
          alert("You have not written reviews!");
        } else{
          review._item = product._id;
          review._user = user_id;
          factory.productReview(review, function(item){
          $scope.itemReviews = item.reviews;
          $scope.review = {};
          alert("Your review has been posted!");
          factory.reviewsProduct(product_id, function(review_result){
          $scope.itemReviews = review_result;
          console.log($scope.itemReviews);
           })
          })
        }
    	}

    $scope.productComment = function(product,comment){
        if(!comment || !comment.comment ){
          alert("You have not written any comments!");
          } else{
          comment._item = product._id;
          comment._user = user_id;
          factory.productComment(comment, function(item){
          console.log(item);
          console.log(item.comments);
          $scope.itemComments = item.comments;
          $scope.comment = {};
          alert("Your comment has been posted!");
          factory.commentsProduct(product_id, function(comment_result){
          $scope.itemComments = comment_result;
           // console.log($scope.itemComments);
             })
           })
          }
      }

    $scope.formReview = function(){
     	if($scope.show_formReview){
    		$scope.show_formReview=false;
    		$scope.btn_review='Review Item';
    		return true;
    		} else{
    		$scope.show_formReview=true;
    		$scope.btn_review='Hide Form';
    		return false;
    		}		
     }

      $scope.formComment = function(){
      if($scope.show_formComment){
        $scope.show_formComment=false;
        $scope.btn_comment='Comment Item';
        return true;
        } else{
        $scope.show_formComment=true;
        $scope.btn_comment='Hide Form';
        return false;
        }   
     }


    $scope.reviews = true
    $scope.switchDetail = function(){
        if($scope.reviews){
            $scope.reviews = false;
            $scope.comments= true;
        } else{
            $scope.reviews = true;
            $scope.comments = false;
        }
    }
     

})