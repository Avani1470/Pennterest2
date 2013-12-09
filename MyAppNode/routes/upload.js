var fs = require('fs');

/// Post files
function upload(req, res) {

	fs.readFile(req.files.image.path, function (err, data) {

		var imageName = req.files.image.name;
		//alert (imageName);

		/// If there's an error
		if(!imageName){

			console.log("There was an error")
			res.redirect("/");
			res.end();

		} else {

		  var newPath = __dirname + "/uploads/" + imageName;
		  console.log("New path is: " + newPath);

		  /// write file to uploads/fullsize folder
		  fs.writeFile(newPath, data, function (err) {

		  	/// let's see it
		  	res.redirect("/uploads/" + imageName);

		  });
		}
	});
}


exports.do_work = function(req, res){
	//console.log("session variable is: "+req.session.lastPage);
	console.log("request i got"+ req.files.image.name);
	console.log("request i got"+ req.files.image.path);
	//console.log("request i got"+ req.query.path);
	//console.log("request i got"+ req);
	upload(req,res);
};
