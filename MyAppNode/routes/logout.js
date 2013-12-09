exports.do_work = function(req, res){
  req.session.user=null;
  res.redirect('/');
};