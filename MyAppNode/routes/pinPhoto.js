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
function query_db_inserttags(res, user, tags, objectid, source)
{
	
	arr = tags.split(',');
	s="insert all into object_tags (objectid, tag, objectsource) values (";
	i=0;
	for (i=0; i<arr.length-1; i++)
		{
		s = s+objectid+", '"+arr[i]+"', '"+source+ "') into object_tags (objectid, tag, objectsource) values (";
		}
	s = s+objectid+", '"+arr[i]+"', '"+source+ "') select * from dual ";
	
	
	
	oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
		  	// selecting rows
	    	console.log("Object id is"+ objectid);
		  	connection.execute(s, [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	console.log("Inserted in TAGS");
		  	    	res.redirect('/home');
		  	    	//console.log(res);
		  	    	
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
	
	
}

function query_db_insertpin(res,user, board, tags, objectid, source, user)
{
	oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
		  	// selecting rows
	    	console.log("Object id is"+ objectid);
		  	connection.execute("insert into PIN (OBJECTID, LOGIN, OBJECTSOURCE, BOARDNAME) VALUES ("+objectid+", '"+ user+"', '"+ source +"', '"+board+"')", 
		  			   [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	console.log("Inserted in PIN");
		  	    	query_db_inserttags(res, user, tags, objectid, source);
		  	    	//console.log(res);
		  	    	
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
			   {results: results[0] }
		  );
}

/////
// This is what's called by the main app 
exports.do_work = function(req, res){
	user = req.session.user;
	query_db_insertpin(res,user, req.query.board, req.query.tags, req.query.objectid, req.query.objectsource, user);
	
		
		//res.redirect('/pinPhoto.js?user='+req.session.user+'&objectid='+req.query.objectid)
		//query_db_pin(res,req.session.user,req.query.objectid);
};