exports.do_work = function(req, res){
	  console.log(req.session.lastPage);
	  res.render('upload.jade', { 
		  title: 'HW2' 
	  });
	};