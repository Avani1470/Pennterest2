// Connect string to Oracle
var connectData = { 
		"hostname" : "pennterest.cf2k3xodmmdr.us-west-2.rds.amazonaws.com",
		"user" : "pennterest_m",
		"password" : "pennterestpassword",
		"database" : "PENNTERE" };
var oracle =  require("oracle");

/////
// Query the oracle database, and call output_actors on the results
//
// res = HTTP result object sent back to the client
// name = Name to query for
function query_db_login(res,req) {
	console.log("before connect");
	  oracle.connect(connectData, function(err, connection) {
		  console.log("inside connect");
		name=req.body.login;
		password=req.body.password;
	    if ( err ) {
	    	console.log(err);
	    	
	    } else {
	    	var i = 0;
	    	var c = 0;
	    	var bcrypt = require('bcrypt');
	    	console.log("before_qquery");
	    	connection.execute("SELECT * FROM users where login=:1", 
		  			   [name], 
		  			   function(err, results) {
	    		console.log("reacheind inside query");
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	
		  	    	for(i = 0 ; i<results.length; i++){
		  	    		if(results[i].ISNEW=='Y')
		  	    			{
		  	    			res.redirect("/tochangepassword/?login="+name+"&value_pwd=pwd");
		  	    			}else
		  	    				{
		  	    					if(bcrypt.compareSync(password, results[i].PASSWORD)==true){c = c + 1;}
		  	    				}
		  	    	}
		  	    	connection.close(); // done with the connection
		  	    	output_login(res, req, c, results);
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
	}

/////
// Given a set of query results, output a table
//
// res = HTTP result object sent back to the client
// name = Name to query for
// results = List object of query results
function output_login(res,req,c,results) {
	
	if (c==0)
		{
			res.render('index.jade',
				   { error:"password incorrect, please try again" }
			  );
		}
	else{
		req.session.user = req.body.login;
		res.redirect('/home');
	}
}

/////
// This is what's called by the main app 
exports.do_work = function(req, res){
	if(req.session.user==null)
		query_db_login(res,req);
	else
		res.redirect('/home');
};
