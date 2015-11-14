

// var myApp = angular.module('myApp', ['ngRoute', 'angularPayments']);
var myApp = angular.module('myApp', ['ngRoute', 'ngCookies','angularPayments']);
	myApp.config(function($routeProvider){
		$routeProvider
			.when('/',{
				templateUrl: 'static/partials/home.html'
			})
			.when('/faq',{
				templateUrl: 'static/partials/faq.html'
			})
			.when('/joinTeam',{
				templateUrl: 'static/partials/confectioner.html'
			})
			.when('/seller',{
				templateUrl: 'static/partials/seller.html'
			})
			.when('/kitchen',{
				templateUrl: 'static/partials/kitchen.html'
			})
			.when('/buyer',{
				templateUrl: 'static/partials/buyer.html'
			})
			.when('/updateProduct/:id',{
				templateUrl: 'static/partials/updateProduct.html'
			})
			.when('/productDetail/:id',{
				templateUrl: 'static/partials/productDetail.html'
			})
			.when('/checkout',{
				templateUrl: 'static/partials/stripe.html'
			})
			.when('/account',{
				templateUrl: 'static/partials/account.html'
			})
			.otherwise({
				redirectTo: '/'
			});
	});