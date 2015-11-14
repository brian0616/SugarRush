myApp.controller('stripeController', function ($scope, $window){

	$window.Stripe.setPublishableKey('pk_test_6pRNASCoBOKtIshFeQd4XMUh');

	$scope.stripeCallback = function (code, result) {		

			if (result.error) {
				window.alert('it failed! error: ' + result.error.message);
			} else {
				window.alert('Successfully placed your order!');
				// success! token: ' + result.id
			}
		}
});
