// Connect string to Oracle
var connectData = { 
		"hostname" : "pennterest.cf2k3xodmmdr.us-west-2.rds.amazonaws.com",
		"user" : "pennterest_m",
		"password" : "pennterestpassword",
		"database" : "PENNTERE" };
var oracle =  require("oracle");

// ///
// Query the oracle database, and call output_actors on the results
//
// res = HTTP result object sent back to the client
// name = Name to query for
function query_db_changepassword(req,res, currentpassword, newpassword, confirmpassword,username) {
  oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    	
    } else {
    	//use this when you integrate to get the exact username
    	//username=request.session.user
    	var i = 0;
    	var c = 0;
    	var bcrypt = require('bcrypt');
    	connection.execute("SELECT * FROM users WHERE LOGIN='"+username+"'", 
	  			   [], 
	  			   function(err, results) {
	  	    if ( err ) {
	  	    	console.log(err);
	  	    } else {
	  	    	for(i = 0 ; i<results.length; i++){
	  	    		console.log(results[i].PASSWORD);
	  	    		console.log(results[i].ISNEW);
	  	    		if(bcrypt.compareSync(currentpassword, results[i].PASSWORD)==true||results[i].ISNEW=='Y'){c = c + 1;}
	  	    	}
	  	    	connection.close(); // done with the connection
	  	    	output_query1(req,res, username, c, results, currentpassword, newpassword, confirmpassword);
	  	    	
	
	  	    }
	  	}); // end connection.execute
    }
  }); // end oracle.connect
}

// ///
// Given a set of query results, output a table
//
// res = HTTP result object sent back to the client
// name = Name to query for
// results = List object of query results
function output_query1(req,res, username, c, results, currentpassword, newpassword, confirmpassword) {
	if (c==0)
	{
		res.redirect('/changepassword/?login='+username);
	
	}
    else if(c==1){
    	 oracle.connect(connectData, function(err, connection) {
    		  if ( err ) {
    		    	console.log(err);
    		    	
    		    } else {
    		    	if(currentpassword!=newpassword&&newpassword==confirmpassword)
    		    		{
    		    		
    		    		// Load the bcrypt module
    		        	var bcrypt = require('bcrypt');
    		        	// Generate a salt
    		        	var salt = bcrypt.genSaltSync(10);
    		        	// Hash the password with the salt
    		        	var hash = bcrypt.hashSync(newpassword, salt);
    		    	  	connection.execute("UPDATE users SET PASSWORD = '"+hash+"',ISNEW='N' WHERE LOGIN = '"+username+"'", [], 
    		 	  			   function(err, results) {
    		 	  	    if ( err ) {
    		 	  	    	console.log(err);
    		 	  	    } else {
    		 	  	    	connection.close(); // done with the connection
    		 	  	    	req.session.user=username;
    		 	  	    	output_changepassword(res, username, results);
    		 	  	    }
    		 	
    		    	  	}); // end connection.execute
    		    		}
    		    	else
    		    		{
    		    		res.render('changepassword.jade',
    		    				   { error:"incorrect details, please try again" }
    		    			  );
    		    			    		
    		    		}
    		    }
    	  }); // end oracle.connect
    }
}
function output_changepassword(res,username,results) {
	
		res.redirect('/home');
}

// ///
// This is what's called by the main app
exports.do_work = function(req, res){
	login='';
	if(req.session.login!=null)
		login=req.session.login;
	else
		login=req.body.login;
	console.log("akjhhj***********"+login);
	query_db_changepassword(req,res,req.body.currentpassword,req.body.newpassword,req.body.confirmpassword,login);
};