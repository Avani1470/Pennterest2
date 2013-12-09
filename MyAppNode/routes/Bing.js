// this somewhere at the top of your code:
var acctKey = 'hn9ky4yNAzGbNdD6FLccyCbqz3g/SqpfdESG9iryM6Q=';
var rootUri = 'https://api.datamarket.azure.com/Bing/Search';
var auth    = new Buffer([ acctKey, acctKey ].join(':')).toString('base64');
var request = require('request').defaults({
  headers : {
    'Authorization' : 'Basic ' + auth
  }
});

// here's how to perform a query:
function search(req, res,searchvalue)
{

  //var service_op  = req.body.service_op;
  //var query       = req.body.query;
	var service_op  = "Image";
	var query       = searchvalue;
  request.get({
    url : rootUri + '/' + service_op,
    qs  : {
      $format : 'json',
      Query   : "'" + query + "'", 
      $top:10// the single quotes are required!
    }
  }, function(err, response, body) {
    if (err)
      return res.send(500, err.message);
    if (response.statusCode !== 200)
      return res.send(500, response.body);
    var results = JSON.parse(response.body);
    console.log(results.d.results.length);
    var resultsarray=[];
   // for(var v=0;v<results.d.results.length;v++)
    for(var v=0;v<results.d.results.length;v++)
    resultsarray.push(results.d.results[v].MediaUrl);
    console.log(resultsarray);
    res.render('Bing.jade',
			   { title: "Bing Search results: ",
			     results: resultsarray }
		  );
    //res.send(results.d.results);
  });
}

exports.do_work = function(req, res){
	//console.log(query.search);
	console.log(req.query.searchinput);
	console.log(req.query.searchtype);
	if(req.query.searchtype=="BingSearch")
		{
	search(req,res,req.query.searchinput);
		}
	else
		{
		//
		console.log("TagSearch");
		}
	//res.render('Bing.jade',{});
}