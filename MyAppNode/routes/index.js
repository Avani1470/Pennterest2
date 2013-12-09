
/*
 * GET home page, which is specified in Jade.
 */

exports.do_work = function(req, res){
	
  if(req.session.user==null)
	 {
	  res.render('index.jade', { 
		  title: 'HW2' 
	  });
	 }
  else
	  res.redirect('/home');
};
