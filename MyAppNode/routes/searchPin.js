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
function query_db(res,search_tag,user) {
	//user = req.session.user;
	
  oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
    	query = "select distinct O.OBJECTID, O.OBJECTURL, O.OBJECTNAME, O.OBJECTSOURCE, (select avg(score) from rating where objectid = O.objectid) AS AVG, " + 
			"(case when exists(select * from PIN where objectid=O.objectid and login ='"+user+"')  then 'Unpin' else 'Pin' end ) as ISPINNED"
  			+" from OBJECTS O, OBJECT_TAGS T where O.objectid = T.objectid and T.tag='"+search_tag+"'";
	  	// selecting rows
    	//SELECT objecturl FROM objects where objectid in (select objectid from pin where login='"+name+"'
	  	connection.execute(query, 
	  			   [], 
	  			   function(err, results) {
	  	    if ( err ) {
	  	    	console.log(err);
	  	    } else {
	  	    	connection.close(); // done with the connection
	  	    	console.log(results);
	  	    	output_actors(res, search_tag, results);
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
function output_actors(res,name,results) {
	//console.log("akdjhlkjfhkj here is output");
	//console.log(results);
	res.render('searchPin.jade',
		   { title: "Photos of " + name,
		     results: results }
	  );
}

/////
// This is what's called by the main app 
exports.do_work = function(req, res){
	query_db(res,req.query.search,req.session.user);
};