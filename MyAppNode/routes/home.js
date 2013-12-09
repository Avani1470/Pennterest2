// Connect string to Oracle
var connectData = { 
  "hostname": "pennterest.cf2k3xodmmdr.us-west-2.rds.amazonaws.com", 
  "user": "pennterest_m", 
  "password": "pennterestpassword", 
  "database": "PENNTERE" };
var oracle =  require("oracle");

/////
// Query the oracle database, and call output_actors on the results
//
// res = HTTP result object sent back to the client
// name = Name to query for

function query_db(res,name) {
	var r1,r2;
  oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
	  	// selecting rows
	  	connection.execute("SELECT objecturl, O.objectid, O.objectsource, objectname , (select avg(score) from rating where objectid = O.objectid) AS AVG FROM objects O where O.objectid in (select objectid from PIN where login='"+name+"')", 
	  			   [], 
	  			   function(err,results) {
	  	    if ( err ) {
	  	    	console.log(err);
	  	    } else {
	  	    	
	  	    	query_db1(res, name, results);
	  	    	console.log(results);
	  	    	
	  	    }
	
	  	}); 
    }
  });  
  
}

function output_users(res,name,results,results1) {
	var obj={"results":results,"results1":results1};
	console.log("last");
	console.log(obj);
	res.render('home.jade',
			   { title: "users with last name " + name,
			     results: obj }
		  );
}

function query_db1(res,name,results) {
	
	oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
		  	
		  	connection.execute("SELECT objecturl FROM objects where rownum <=5", 
		  			   [], 
		  			   function(err,results1) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	connection.close(); 
		  	    	output_users(res, name, results,results1);
		  	    	
		  	    }
		
		  	}); 
	    }
	  });
	

	
}

/////
// This is what's called by the main app 
exports.do_work = function(req, res){
	
	query_db(res,req.session.user);
};