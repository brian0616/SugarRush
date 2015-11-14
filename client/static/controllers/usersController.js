myApp.controller('usersController', function($scope, $cookies, $location, factory){
    $scope.users = [];
    $scope.user = {};

    $scope.favorites= true;
    
    // factory.accountUser(user_id,function(data){
    //       console.log(data);
    // })

    var user_loggedin = sessionStorage.getItem('user_loggedin');
    if(user_loggedin){
         var user_id = sessionStorage.getItem('user_id');
         factory.accountUser(user_id, function(data){
            console.log(data);
        $scope.user = data;
         })
    }

    $scope.chefLogin = function (login) {
        var chef_id = sessionStorage.getItem('user_id');
        $scope.chef = JSON.parse(sessionStorage.getItem('user'));
        $scope.error = "";

        if($scope.chef){
            $location.path('/seller');
          } else{
            factory.chefLogin(login, function(data){ 
            if(data == "Invalid patissier login"){
                $scope.errors.push(data);
                } else{
                sessionStorage.setItem('user',JSON.stringify(data));
                sessionStorage.setItem('user_id',data._id); 
                sessionStorage.setItem('chef_loggedin',true); 

                var chef_id = sessionStorage.getItem('user_id');
                $scope.chef = JSON.parse(sessionStorage.getItem('user'));
                $scope.login = {};
                $location.path('/seller');    
                }
            })
         }
        }

    $scope.userLogin = function (login) {
        var user_id = sessionStorage.getItem('user_id');
        $scope.user = JSON.parse(sessionStorage.getItem('user'));
        $scope.error = "";

        console.log($scope.user);
        if($scope.user){
            $('#login_main').modal('hide');
            $location.path('/buyer'); 
         } else{
            factory.userLogin(login, function(data){

            console.log(data);
             if(data.message){
                $scope.error = data.message;
                } else{
                // $scope.user = data;
                sessionStorage.setItem('user',JSON.stringify(data));
                sessionStorage.setItem('user_id',data._id);
                sessionStorage.setItem('user_loggedin',true); 

                var user_id = sessionStorage.getItem('user_id');
                $scope.user = JSON.parse(sessionStorage.getItem('user'));
                        
                console.log(user_id);
                console.log($scope.user);
                $scope.login = {};
                console.log($scope.session);
                $('#login_main').modal('hide');
                $location.path('/buyer');    
                }
             })
         }
    }

     $scope.userLogout = function () {
        sessionStorage.removeItem('user_id');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('user_loggedin');
        sessionStorage.removeItem('chef_loggedin');
        $scope.user = {};
        $location.path('/');   
    }

    $scope.accountUser = function(){
        var user_loggedin = sessionStorage.getItem('user_loggedin');
        if (user_loggedin){
            return true;
        } else{
            return false;
        }
    }

    $scope.accountChef = function(){
        var chef_loggedin = sessionStorage.getItem('chef_loggedin');
        if (chef_loggedin){
            return true;
        } else{
            return false;
        }
    }

    $scope.userAdd= function (user){
    $scope.message = "";
        factory.register(user, function(data){
            if(data.message){
                $scope.message = data.message;
            } else {
                $scope.message = 'Registration successful, please log in!'; 
                user_id = data._id;
                var cart = {orders:[]}
                $cookies.putObject(user_id,cart);  
                $scope.userNew = {};        
            }
         });

    }

    $scope.updatePass=function(pass){
        pass.user_id=user_id;
        factory.updatePass(pass, function(data){
            if(data.message){
              $scope.error = data.message;
            } else{
              $scope.message = "Password change successful!";
            }
             $scope.chng = false
        })
    }

    $scope.updateAcct=function(infoUser){
        factory.updateAcct(infoUser, function(data){
            $scope.message = data.message;
            $scope.edit = false
        })
    }

    $scope.listSave=function(){
        factory.listSave(user_id,$scope.user.favorites, function(data){
        })
    }

    $scope.itemlistEdit=function($index){
        if($scope.editActive){
            $scope.indexList=$index;
        }
    }

    $scope.listUp = function(){
        var indexNow = $scope.indexList;
        if(indexNow != 0){
            var itemNow = $scope.user.favorites[indexNow];
            $scope.user.favorites[indexNow] = $scope.user.favorites[indexNow-1];
            $scope.user.favorites[indexNow-1] = itemNow; 
            $scope.indexList = indexNow-1;
        }
    }

    $scope.listDwn = function(){
        var indexNow = $scope.indexList;
        if(indexNow+1 != $scope.user.favorites.length){
            var itemNow = $scope.user.favorites[indexNow];
            $scope.user.favorites[indexNow] = $scope.user.favorites[indexNow+1];
            $scope.user.favorites[indexNow+1] = itemNow; 
            $scope.indexList = indexNow+1;
        } 
    }

    $scope.listRm = function(){
        var indexNow = $scope.indexList;
        console.log($scope.user.favorites[indexNow]);
        $scope.user.favorites.splice(indexNow,1);
        $scope.indexList=null;
    }

    $scope.editActive=false;
    $scope.listEdit = function(){
        if($scope.editActive){
            $scope.editActive=false;
            $scope.indexList=null;
        } else{
            $scope.editActive=true;
        }
    }

    $scope.profile= true;
    $scope.switchInfo = function(variable){
        if(variable){
            $scope.profile = false;
            $scope.historyOrder= true;
        } else{
            $scope.profile = true;
            $scope.historyOrder = false;
        }
    }

    $scope.edit=false;
    $scope.editAcct=function(){
        $scope.message="";
        if($scope.edit){
            $scope.edit=false;
        } else{
            $scope.edit=true;
            $scope.chng=false
        }
    }

    $scope.chng=false;
    $scope.chngPass=function(){
        $scope.message="";
        if($scope.chng){
            $scope.chng=false;
        } else{
            $scope.chng=true;
            $scope.edit=false;
        }
    }
    
})