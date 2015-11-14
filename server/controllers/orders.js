// this is our friends.js file located at /server/controllers/friends.js
// note the immediate function and the object that is returned

// First add the following two lines at the top of the friends controller so that we can access our model through var Friend
// need to require mongoose to be able to run mongoose.model()
var mongoose = require('mongoose');
var Order = mongoose.model('Order');
var User = mongoose.model('User');
var Product = mongoose.model('Product');
var Vendor = mongoose.model('Vendor');

module.exports = (function() {
 return {

  orderGet: function(req, res) {
     
      Order.find({_user: req.query.id}, function(err, orders) {
       if(err) {
         console.log(err);
         } else {
           // res.json(results);
          }
        })
          .populate('items')
          .exec(function(err, orders) {
            if(err) {
               console.log('Unable to retrieve items');
             } 
             else { 
               console.log('successfully collected all items!');
               console.log(users);
            }
       })
      res.json(orders);
    },

    orderCheckout: function(req,res){
      console.log('checkout order');
      console.log(req.body);

      Vendor.findOne({_id: req.body.order.item._confectioner}, function(err, vendor){
           if(err) {console.log('Error');
            } 
            else {         
              var newOrder = new Order({
              _user: req.body.user,
              total: req.body.order.info.total,
              quantity: req.body.order.info.quantity,
              item: req.body.order.item._id,
              });
              vendor.orders.push(newOrder._id);
              newOrder.save();
              vendor.save(function(err){
                if(err) {console.log('Error');
                  } 
                else {
                  User.findOne({_id: req.body.user}, function(err,user){
                    if(err){console.log("Error finding user")
                      } else{
                        user.orders.push(newOrder);
                        user.save();
                        res.json({user: user, 
                           vendor_email: vendor.email, 
                           result: 'Order has been placed'});
                       }
                  
                     })                
                  }
              });
            }
         });
    },


    orderStatus: function(req, res){
      console.log(req.body);
      Order.update({_id: req.body.order._id}, 
        {status: req.body.order.status, dateUpdated: new Date()}, 
        function(err, order){
        if(err) {
          console.log('Error');
        } 
        else { 
          console.log('done');
        }
      })
    }
    // orderRemove: function(req, res) {
    //  console.log(req.body);
    //  order = {
    //   user: req.body.user, 
    //   item: req.body.item,
    //   quantity: req.body.quantity,
    //   dateOrdered: req.body.dateOrdered,
    //   dateUpdated: req.body.dateUpdated
    //   };

    //  Order.remove(order,function(err) {
    //   if(err) {
    //      console.log(err);
    //       } else {
    //      res.redirect('/orders');
    //       }
    //   })
    // }

}})();