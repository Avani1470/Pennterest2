/**
 * Simple Homework 2 application for CIS 550
 * 
 * zives
 */

/**
 * Module dependencies.
 */
var express = require('express')
  , routes = require('./routes')
  , mongo = require('./routes/mongo')
  
  
  , login = require('./routes/login')
  , tochangepassword = require('./routes/tochangepassword')
  , changepassword = require('./routes/changepassword')
  , toregister = require('./routes/toregister')
  , register = require('./routes/register')
  , home = require('./routes/home')
  ,user=require('./routes/user')
  , friends = require('./routes/friends')
  
  , boards = require('./routes/boards')
  , addBoard = require('./routes/addBoard')
  , deleteBoard = require('./routes/deleteBoard')
  
  , add_delete_friend = require('./routes/add_delete_friend')
   , search_friends = require('./routes/search_friends')
   , Bing = require('./routes/Bing')
   
   , upload = require('./routes/upload')
  , searchPin = require('./routes/searchPin.js')
  , pin_unpin = require('./routes/pin_unpin.js')
  , pinPhoto = require('./routes/pinPhoto.js')
  , callfileupload = require('./routes/callfileupload.js')
  
  
    , logout = require('./routes/logout')
  , http = require('http')
  , path = require('path')
  , stylus =  require("stylus")
  , nib =     require("nib")
;
/// Include the node file module
var fs = require('fs');

/// Include ImageMagick
var im = require('imagemagick');
// Initialize express
var app = express();
// .. and our app
init_app(app);


app.get('/', routes.do_work);

app.get('/mongo', mongo.do_work);

app.post('/login', login.do_work);

app.get('/home', home.do_work);

app.get('/friends', friends.do_work);

app.get('/toregister', toregister.do_work);

app.get('/register', register.do_work);

app.get('/tochangepassword', tochangepassword.do_work);

app.post('/changepassword', changepassword.do_work);

app.get('/Bing', Bing.do_work);

app.get('/user', user.do_work);

app.get('/boards', boards.do_work);
app.get('/addBoard', addBoard.do_work);
app.get('/deleteBoard', deleteBoard.do_work);

app.get('/add_delete_friend', add_delete_friend.do_work);

app.get('/search_friends', search_friends.do_work);

app.get('/searchPin', searchPin.do_work);
app.get('/pin_unpin', pin_unpin.do_work);
app.get('/pinPhoto', pinPhoto.do_work);
app.post('/upload', upload.do_work);
app.get('/callfileupload', callfileupload.do_work);

app.get('/logout', logout.do_work);

app.get('/uploads/:file', function (req, res){
	file = req.params.file;
	var img = fs.readFileSync(__dirname + "/routes/uploads/" + file);
	res.writeHead(200, {'Content-Type': 'image/jpeg' });
	res.end(img, 'binary');

});


// Listen on the port we specify
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});





///////////////////
// This function compiles the stylus CSS files, etc.
function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}

//////
// This is app initialization code
function init_app() {
	// all environments
	app.set('port', process.env.PORT || 8080);
	
	// Use Jade to do views
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');

	app.use(express.favicon());
	// Set the express logger: log to the console in dev mode
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser());
	app.use(express.session({secret: '1234567890QWERTY'}));
	
	app.use(function(req,res,next){
	    res.locals.session = req.session.user;
	    next();
	});
	
	app.use(app.router);
	// Use Stylus, which compiles .styl --> CSS
	app.use(stylus.middleware(
	  { src: __dirname + '/public'
	  , compile: compile
	  }
	));
	app.use(express.static(path.join(__dirname, 'public')));

	// development only
	if ('development' == app.get('env')) {
	  app.use(express.errorHandler());
	}

}