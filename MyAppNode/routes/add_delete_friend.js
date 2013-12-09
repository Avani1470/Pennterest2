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
function query_db_delete_friend(res,name,friend_login) {
  oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
	  	// selecting rows
	  	connection.execute("delete from follower where follower='"+name+"' and following='"+friend_login+"'", 
	  			   [], 
	  			   function(err, results) {
	  	    if ( err ) {
	  	    	console.log(err);
	  	    } else {
	  	    	connection.close(); // done with the connection
	  	    	output_friends(res);
	  	    }
	
	  	}); // end connection.execute
    }
  }); // end oracle.connect
}

function query_db_add_friend(res,name,friend_login) {
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
		  	// selecting rows
		  	connection.execute("insert into follower(follower,following) values('"+name+"','"+friend_login+"')", 
		  			   [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	connection.close(); // done with the connection
		  	    	output_friends(res);
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
function output_friends(res) {
	res.redirect('/friends');
}

/////
// This is what's called by the main app 
exports.do_work = function(req, res){
	if(req.query.isdelete=='delete')
		query_db_delete_friend(res,req.session.user,req.query.login);
	else
		query_db_add_friend(res,req.session.user,req.query.login);
};
