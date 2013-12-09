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
	  	connection.execute("select DISTINCT T2.OBJECTID,T2.OBJECTNAME,T1.BOARDNAME,T4.SCORE,T2.OBJECTURL from PIN T1 INNER JOIN OBJECTS T2 on T1.OBJECTID=T2.OBJECTID AND T1.OBJECTSOURCE=T2.OBJECTSOURCE LEFT OUTER JOIN OBJECT_TAGS T3 on T3.OBJECTID=T2.OBJECTID AND T3.OBJECTSOURCE=T2.OBJECTSOURCE LEFT OUTER JOIN RATING T4 ON T4.OBJECTID=T1.OBJECTID AND T4.SOURCE=T1.OBJECTSOURCE AND T4.LOGIN=T1.LOGIN where T1.LOGIN ='"+name+"'", 
	  			   [], 
	  			   function(err,results) {
	  	    if ( err ) {
	  	    	console.log(err);
	  	    } else {
	  	    	//connection.close(); // done with the connection
	  	    	//query_db1(res, name, results);
	  	    	output_users1(res, name, results);
	  	    	console.log(results);
	  	    	//r1=results;
	  	    }
	
	  	}); // end connection.execute
		/*connection.execute("SELECT OBJECTID,BOARDNAME,OBJECTSOURCE FROM PIN where LOGIN='"+name+"'", 
	  			   [], 
	  			   function(err,results) {
	  	    if ( err ) {
	  	    	console.log(err);
	  	    } else {
	  	    	//connection.close(); // done with the connection
	  	    	//output_users(res, name, results,results1);
	  	    	//console.log("here");
	  	    	console.log(results);
	  	    	
	  	    	r2=results;
	  	    }
	  	});
		connection.close();*/ 
    }
  });  
  //output_users(res, name, r1,r2);
}

function output_users1(res,name,results) {
	
	res.render('user.jade',
			   { title: "Details of user "+name,
			     results: results }
		  );
}

function output_users(res,name,results,results1) {
	var obj={"results":results,"results1":results1};
	console.log("last");
	console.log(obj);
	res.render('user.jade',
			   { title: "users with last name " + name,
			     results: results }
		  );
}
/////
// Given a set of query results, output a table
//
// res = HTTP result object sent back to the client
// name = Name to query for
// results = List object of query results
function query_db1(res,name,results) {
	//console.log(results);
	
	//
	
	oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
		  	// selecting rows
		  	connection.execute("SELECT OBJECTID,BOARDNAME,OBJECTSOURCE FROM PIN where LOGIN='"+name+"'", 
		  			   [], 
		  			   function(err,results1) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	connection.close(); // done with the connection
		  	    	output_users(res, name, results,results1);
		  	    	//console.log("here");
		  	    	//console.log(results1);
		  	    }
		
		  	}); // end connection.execute
	    }
	  });
	

	
}

function levenstdist()
{
	var natural = require('natural');
	console.log("first");
	console.log(natural.LevenshteinDistance("ones","onez"));
	console.log("second");
	console.log(natural.LevenshteinDistance('one', 'one'));
	var wordnet = new natural.WordNet();

	wordnet.lookup('node', function(results) {
	    results.forEach(function(result) {
	        console.log('------------------------------------');
	        console.log(result.synsetOffset);
	        console.log(result.pos);
	        console.log(result.lemma);
	        console.log(result.synonyms);
	        console.log(result.pos);
	        console.log(result.gloss);
	        wordnet.get(result.synsetOffset, result.pos, function(result) {
	            console.log('------------------------------------');
	            console.log(result.lemma);
	            console.log(result.pos);
	            console.log(result.gloss);
	            console.log(result.synonyms);
	            console.log(result.hypernym);
	            console.log(result.hypernyms);
	            console.log(result.hyponym);
	            console.log(result.hyponyms);
	        });
	    });
	});
}
/////
// This is what's called by the main app 
exports.do_work = function(req, res){
	levenstdist();
	query_db(res,req.session.user);

};
