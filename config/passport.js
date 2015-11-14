var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
// var User = require('../server/models/user');
// console.log(User);
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

      passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
   		},

    	function(req, email, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {	

        console.log(email);
        console.log(req.body);
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);
            if (password !== req.body.passconf)
                return done(null, false, {message: 'Passwords do not match.'});

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, {message: 'That email is already taken.'});
            } else {

                // if there is no user with that email
                // create the user
                var newUser = new User({
                	first_name: req.body.first_name,
                	last_name: req.body.last_name,
                	email: req.body.email,
                   	});

                newUser.password = newUser.generateHash(req.body.password);

                // set the user's local credentials
                // newUser.local.email    = email;
                // newUser.local.password = ;

                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });    

        });

    }));

	passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form
    	console.log(email)
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, {message: 'No user found.'}); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, {message: 'Incorrect password.'}); // create the loginMessage and save it to session as flashdata

            console.log(user);
            console.log("successful login!")
            // all is well, return successful user
            return done(null, user);
        });

    }));

    passport.use('local-password', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'user_id',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, user_id, password, done) { // callback with email and password from our form
        console.log(user_id);
        console.log(req.body);
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({_id: user_id}, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);
            if (!user.validPassword(password))
                return done(null, false, {message: 'Incorrect password.'}); // create the loginMessage and save it to session as flashdata
            // if no user is found, return the message
            if (req.body.passnew != req.body.passconf)
                return done(null, false, {message: 'Passwords do not match.'}); // req.flash is the way to set flashdata using connect-flash

            user.password = user.generateHash(req.body.passnew);
            console.log(user);
            console.log("successful password change!")
            // if the user is found but the password is wrong
            user.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, user);
                });
           // all is well, return successful user
        });
    }));




};