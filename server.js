var express = require('express');
var app = express();
var path = require('path');
var multer = require('multer');
var expressSession = require('express-session');
var flash    = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy
// var bootstrap = require('bootstrap');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './client')));


app.use(expressSession({secret: 'sugarRUSH'}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());



// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'SugarRush.effect@gmail.com',
        pass: 'codingdojo'
    }
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './client/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({storage: storage});

require('./config/mongoose.js');
require('./config/passport')(passport);
require('./config/routes.js')(app, upload, passport,transporter);

app.listen(8888, function(){
	console.log('we are listening on port 8888');
})