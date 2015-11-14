// this is our friends.js file located at /server/controllers/friends.js
// note the immediate function and the object that is returned

// First add the following two lines at the top of the friends controller so that we can access our model through var Friend
// need to require mongoose to be able to run mongoose.model()
var mongoose = require('mongoose');
// require('../models/customer');
var User = mongoose.model('User');

module.exports = (function() {
 return {
  userList: function(req, res) {
     User.find({}, function(err, results) {
       // console.log(results);
       if(err) {
         console.log(err);
       } else {
         // console.log(results);
         res.json(results);
       }
   })
  },

    updateUser: function(req, res) {
      console.log(req.body.user.email)

      User.findOne({'email':req.body.user.email}, function(err, result) {
       // console.log(results);
       console.log('query');
       console.log(result._id);
       console.log(req.body.user._id);
       if(result._id != req.body.user._id){
        res.json({message: 'This email has been taken already.'});
       } else{
           User.update({_id:req.body.user._id}, 
            req.body.user, function(err, user) {
       // console.log(results);
               if(err) {
                 console.log(err);
               } else {
                 
                 res.json({message: 'Your information has been updated!'});
               }
             })
           }
         })
       },

  // userLogin: function(req, res) {
  //   // User.findOne({email: req.body.email}, function(err, result){
  //   //   if(err){
  //   //       console.log('error with user login');
  //   //     } else {
  //   //       res.json(result);
  //   //     }
  //   // })
  //   passport.authenticate('local', function(err, user, info) {
  //   if (err || !user) {
  //     res.send(400, info);
  //     } else {
  //     // Remove sensitive data before login
  //       user.password = undefined;
  //       user.salt = undefined;

  //       req.login(user, function(err) {
  //         if (err) {
  //           res.send(400, err);
  //         } else {
  //           res.jsonp(user);
  //         }
  //       });
  //     }
  //   })(req, res, next);
  // },

  favProduct: function(req, res) {
        var newUser = new User(req.body);
        newUser.save(function(err, result) {
        if(err) {
          console.log('error in registering user to db');
          } else {
          console.log(newUser.first_name + ' ' + newUser.last_name + ' has been added!');
          res.json(result);
          }
      }
    )},

   accountUser: function(req,res){
      console.log(req.query.user)
      User.findOne({_id:req.query.user})
      .populate('orders')
      .populate('favorites')
      .exec(function(err, user){
        if(err) {
         console.log('error in grabbing all inventory');
       } else {
         // console.log(product);

        User.populate(user,             
            {path: 'orders.item',
              model: 'Product'}, 
              function (err, result) {
                console.log(result)
              res.json(result);
             });
          }
      })

    },


    listSave_user: function(req,res){
      User.findOne({_id:req.body.user}, function(err, user){
        user.favorites=req.body.list;
        user.save()
      })
   }

    // userRemove: function(req, res) {
    //  console.log(req.body);
    //  user = {name: req.body.name, dateCreated: req.body.dateCreated};
    //  User.remove(user,function(err) {
    //   if(err) {
    //      console.log(err);
    //       } else {
    //      res.redirect('/');
    //       }
    //   })
    // }

}})();