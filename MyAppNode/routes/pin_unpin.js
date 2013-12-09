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
function query_db_unpin(res,user,objectid, source) {
  oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
	  	// selecting rows
    	console.log("Deleting source: "+source);
	  	connection.execute("delete from PIN where objectid='"+objectid+"' and login='"+user+"' and objectsource='"+source+"'", 
	  			   [], 
	  			   function(err, results) {
	  	    if ( err ) {
	  	    	console.log(err);
	  	    } else {
	  	    	connection.close(); // done with the connection
	  	    	console.log("Deleted Pin");
	  	    	res.redirect('/home');
	  			  

	  	    }
	
	  	}); // end connection.execute
    }
  }); // end oracle.connect
}

function query_db_pin(res,user,objectid, source) {
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
		  	// selecting rows
		  	connection.execute("select O.objectid, O.objectname, O.objecturl, O.objectsource from OBJECTS O where O.objectid='"+objectid+"' and O.objectsource='"+source+"'", 
		  			   [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	console.log("From Pin");
		  	    	console.log(results);
		  	    	connection.close(); // done with the connection
		  	    	output_friends(res,results);
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
function output_friends(res, results) {
	console.log("Results of pin");
	console.log(results[0]);
	res.render('pinPhoto.jade',
			   {results: results[0]}
		  );
}

/////
// This is what's called by the main app 
exports.do_work = function(req, res){
	//user = req.session.user;
	console.log(req.query.ispinned);
	if(req.query.ispinned == 'Unpin')
		{
		console.log("In do work"+req.query.objectsource);
		query_db_unpin(res,req.session.user,req.query.objectid, req.query.objectsource);
		}
	else
		query_db_pin(res,req.session.user,req.query.objectid, req.query.objectsource);
		//res.redirect('/pinPhoto.js?user='+req.session.user+'&objectid='+req.query.objectid)
		//query_db_pin(res,req.session.user,req.query.objectid);
};