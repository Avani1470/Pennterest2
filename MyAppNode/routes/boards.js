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
function query_db(res,name) {
  oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
	  	// selecting rows
	  	connection.execute("select BOARDNAME,boardtype,ownerlogin, " +
	  			"(select OBJECTURL from objects where objectid in " +
	  			"(select objectid from pin where pin.boardname=board.boardname " +
	  			"and pin.login=board.ownerlogin and rownum<=1 )) as photo  from board where ownerlogin=" + 
	  			"'"+name+"'", 
	  			   [], 
	  			   function(err, results) {
	  	    if ( err ) {
	  	    	console.log(err);
	  	    } else {
	  	    	connection.close(); // done with the connection
	  	    	output_actors(res, name, results);
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
	res.render('boards.jade',
		   { title: "Boards of " + name,
			login:name,
		     results: results }
	  );
}

/////
// This is what's called by the main app 
exports.do_work = function(req, res){
	if(req.query.login==null)
		query_db(res,req.session.user);
	else
		query_db(res,req.query.login);
};
