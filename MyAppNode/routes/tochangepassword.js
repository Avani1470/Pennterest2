
exports.do_work = function(req, res){
  res.render('changepassword.jade', { 
	  title: 'Change Password', login:req.query.login, password:req.query.value_pwd 
  });
};