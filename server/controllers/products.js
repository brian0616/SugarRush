// this is our friends.js file located at /server/controllers/friends.js
// note the immediate function and the object that is returned

// First add the following two lines at the top of the friends controller so that we can access our model through var Friend
// need to require mongoose to be able to run mongoose.model()
var mongoose = require('mongoose');
// require('../models/customer');
var Product = mongoose.model('Product');
var User = mongoose.model('User');
var Vendor = mongoose.model('Vendor');
var Review = mongoose.model('Review');
var Comment = mongoose.model('Comment');

module.exports = (function() {
 return {
  inventory: function(req, res) {
     Product.find({_confectioner: req.params.id}, function(err, results) {
       // console.log(results);
       if(err) {
         console.log('error in grabbing all inventory of one vendor');
       } else {
         // console.log(results);
         res.json(results);
       }
   })
  },

  allInventory: function(req, res) {
     Product.find({}, function(err, results) {
       // console.log(results);
       if(err) {
         console.log('error in grabbing all inventory');
       } else {
         // console.log(results);
         res.json(results);
       }
   })
  },

  productAdd: function(req, res) {
    Vendor.findOne({_id:req.body._confectioner}, function(err, vendor){
        newProduct = new Product(req.body);
        vendor.products.push(newProduct);
        vendor.save();
        newProduct.save(function(err) {
          if(err) {
            console.log('error in adding a product');
            res.json({message: 'Error in adding a product'})
            } else {
            console.log('New product has been added!');
            res.json({message: newProduct.product +' has been added!'});
          }
        })
      })
    },

  infoProduct: function(req, res){
    Product.findOne({_id: req.body.id})
      .populate('_confectioner')
      .populate('reviews')
      .exec(function(err, product){
        if(err) {
         console.log('error in grabbing all inventory');
       } else {
         // console.log(product);

        // Product.populate(product,             
        //     {path: 'reviews._user',
        //       model: 'User'}, 
        //       function (err, result) {
        //         console.log(result)
        //       res.json(result);
        //      });
         res.json(product);
       }
      })
  },

  reviewsProduct: function(req, res){
     Review.find({_item: req.params.id}, function(err, reviews) {
       // console.log(results);
      })
      .populate('_user')
      .exec(function(err, reviews){
        if(err) {
         console.log('error in grabbing all reviews');
       } else {
         // console.log(reviews);
         res.json(reviews);
       }
     })
  },

  commentsProduct: function(req, res){
     Comment.find({_item: req.params.id}, function(err, comments) {
       // console.log(results);
      })
      .populate('_user')
      .exec(function(err, comments){
        if(err) {
         console.log('error in grabbing all reviews');
       } else {
         // console.log(reviews);
         console.log('comments');
         console.log(comments);
         res.json(comments);
       }
     })
  },

  editProduct: function(req, res){
    Product.update({_id: req.body.info._id}, 
      {
        product: req.body.info.product,
        price: req.body.info.price,
        serving: req.body.info.serving,
        ingredients: req.body.info.ingredients,
        description: req.body.info.description
      },
      function(err){
        if(err) {
         console.log('error in adding a product');
          } else {
         console.log('product has been updated!');
         res.end();
          }
      })
  },

  updateUrl: function(req, res){
    console.log(req.file);
    Product.update({_id:req.body.productId}, {url: '../../uploads/'+ req.file.filename}, 
      function(err, results){
        if(err) {
         console.log('error in adding a product');
          } else {
         console.log('product has been updated!');
         
          }
      })
  },

  productRemove: function(req, res) {
   console.log(req.body);
   var product = {id: req.body.id}
     Product.remove(product,function(err) {
      if(err) {
         console.log(err);
          } else {
         res.redirect('/products');
          }
      })
    },

  productReview: function(req,res){
    console.log(req.body);

          Product.findOne({_id: req.body.review._item}, function(err, item){
           if(err) {console.log('Error');
            } 
            else {         
              var review = new Review(req.body.review);
              item.reviews.push(review._id);
              review.save();
              item.save(function(err){
                if(err) {console.log('Error');
                  } 
                else {
                  User.findOne({_id: req.body.review._user}, function(err,user){
                    if(err){console.log("Error finding user")
                      } else{
                        user.reviews.push(review);
                        user.save();
                        res.json({result: 'Your review has been saved.'});
                      }
                  
                     })                
                  }
              });
            }
         });

    },

    productComment: function(req,res){
    console.log(req.body);
          Product.findOne({_id: req.body.comment._item}, function(err, item){
           if(err) {console.log('Error');
            } 
            else {         
              var comment = new Comment(req.body.comment);
              item.comments.push(comment._id);
              comment.save();
              item.save(function(err){
                if(err) {console.log('Error');
                   } 
                else {
                    res.json(item);               
                  }
              });
            }
         });
    },

    prodFavorite: function(req, res) {
        console.log(req.body);
        User.findOne({_id:req.body.user}, function(err, user){
        
        var exist=false;
          for(var i=0; i<user.favorites.length;i++){
            if(user.favorites[i] == req.body.product._id){
              exist=true
              res.json({message: 'You have already added this item to your favorites.'})
            }
          }
          if(!exist){
            user.favorites.push(req.body.product._id);
            user.save(function(err) {
             if(err) {
              console.log('error in favoriting a product');
              res.json({message: 'Error in favoriting a product'})
              } else {
              console.log('New product has been added!');
              res.json({message: 'You have added '+ req.body.product.product +' to your favorites!'});
              }
            })
          }
        })
     },

    favoritesUser: function(req, res) {
      console.log(req.query.user)
        User.findOne({_id: req.query.user}, function(err, user) {
        // console.log(results);
        })
        .populate('favorites')
        .exec(function(err,user){
          if(err) {
            console.log('error in grabbing all favorites');
            } else {
           // console.log(user);
            res.json(user);
          }
        })
     },




}})();
