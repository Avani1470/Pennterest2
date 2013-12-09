var connectData = { 
		"hostname" : "pennterest.cf2k3xodmmdr.us-west-2.rds.amazonaws.com",
		"user" : "pennterest_m",
		"password" : "pennterestpassword",
		"database" : "PENNTERE" };
var oracle =  require("oracle");





function query_db(res, boardname, login, user)
{
	
	if(login == user)
		query = "select O.objectid, O.objectname, O.objecturl, O.objectsource, 'Unpin' as ISPINNED from OBJECTS O, PIN P where O.objectid=P.objectid and O.objectsource = P.objectsource and P.login='"+login+"' and P.boardname='"+boardname+"'"
		else
		query = "select O.objectid, O.objectname, O.objecturl, O.objectsource, 'Pin' as ISPINNED from OBJECTS O, PIN P where O.objectid=P.objectid and O.objectsource = P.objectsource and P.login='"+login+"' and P.boardname='"+boardname+"'"
			
	 oracle.connect(connectData, function(err, connection) {
		    if ( err ) {
		    	console.log(err);
		    } else {
			  	// selecting rows
			  	connection.execute(query, 
			  			   [], 
			  			   function(err, results) {
			  	    if ( err ) {
			  	    	console.log(err);
			  	    } else {
			  	    	console.log(results);
			  	    	connection.close(); // done with the connection
			  	    	output_friends(res,results, boardname, login);
			  	    }
			
			  	}); // end connection.execute
		    }
		  }); // end oracle.connect

}

function output_friends(res, results, boardname, login) {
	console.log("Results of pin");
	console.log(results);
	res.render('boarddetails.jade',
			   {results: results,
		title: "Photos in board " + boardname + ", Owner is "+login
		}
		  );
}



exports.do_work = function(req, res){
	console.log(req.query.board_name);
	console.log(req.query.owner_login);
	
	query_db(res, req.query.board_name, req.query.owner_login, req.session.user)
	
	
	
	
}
	