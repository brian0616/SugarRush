myApp.controller('productsController', function ($scope, $routeParams, factory, $location){
 
    var product_id = $routeParams.id;
    var chef_id = sessionStorage.getItem('user_id');
    $scope.chef = JSON.parse(sessionStorage.getItem('user'));
    $scope.orders = [];
    $scope.products = [];
    $scope.updateProduct = {};

    factory.inventory(chef_id, function(data){
        $scope.products = data;
    }) 
    
    factory.productById(product_id, function(data){
        $scope.updateProduct = data;
    })

    factory.chefOrders(chef_id, function(data){
         $scope.orders = data.orders;
    })

    $scope.editProduct = function(id){
        factory.editProduct($scope.updateProduct);
    }
    
    $scope.productAdd = function (newProduct){
        // newProduct.url = './static/css/plate.png';
        newProduct._confectioner = chef_id;
        // console.log(newProduct);
        factory.productAdd(newProduct, function(message){
            alert(message);
        });
        // clear the form values
        $scope.newProduct = {};
        factory.inventory(chef_id, function(data){
            $scope.products = data;
        }); 
    }

    $scope.orderStatus = function(order){
        alert('change status');
        factory.orderStatus(order);
    }




})