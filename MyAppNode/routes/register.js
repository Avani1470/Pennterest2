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
function query_db_register(res, firstname, lastname, dob, gender, affiliation, emailid, password, confirmpassword) {
  oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    	
    } else {
    	// Load the bcrypt module
    	var bcrypt = require('bcrypt');
    	// Generate a salt
    	var salt = bcrypt.genSaltSync(10);
    	// Hash the password with the salt
    	var hash = bcrypt.hashSync(password, salt);
    	var gen = 'M';
    		if(gender=="male")
    			{gen = 'M';}
    		else if(gender=="female")
    			{gen = 'F';}
    	
	  	connection.execute("INSERT INTO users (GENDER, DOB, AFFILIATION, GIVENNAME, SURNAME, EMAIL, LOGIN, PASSWORD,ISNEW) VALUES ('"+gen+"','"+dob+"','"+affiliation+"','"+firstname+"','"+lastname+"','"+emailid+"','"+emailid+"','"+hash+"','N')", [], 
	  			   function(err, results) {
	  	    if ( err ) {
	  	    	console.log(err);
	  	    } else {
	  	    	connection.close(); // done with the connection
	  	    	output_login(res, firstname, results);
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
function output_login(res,name,results) {
	
		res.render('login.jade',
			   { title: "Registration Sucessfull, Please login with your password" + name,
			     results: results }
		  );
}

/////
// This is what's called by the main app 
exports.do_work = function(req, res){
	query_db_register(res,req.query.firstname,req.query.lastname,req.query.dob,req.query.gender,req.query.affiliation,req.query.emailid,req.query.password,req.query.confirmpassword);
};