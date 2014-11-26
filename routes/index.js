
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: '对子应用' });
};

exports.login = function(req, res){
    console.log("用户登陆.................");
	res.render('login', { title: '用户登陆'});
};

exports.doLogin = function(req, res){
    console.log("dologin2222222222:       "+req.body.username);
	var user={
		username:'admin',
		password:'admin'
	}
    console.log("dologin:       "+req.body.username);
	if(req.body.username===user.username && req.body.password===user.password){
		req.session.user=user;
	    return res.redirect('/home');
	} else {
		req.session.error='用户名或密码不正确';
		return res.redirect('/login');
	}
	
};

exports.logout = function(req, res){
	req.session.user=null;
	res.redirect('/');
};

exports.home = function(req, res){
  	res.render('home', { title: 'Home'});
};

//如果是Post 请使用req.body['argument']来处理数据 参考 https://cnodejs.org/topic/50a333d7637ffa4155c62ddb
exports.register = function(req,res)
{
    console.log(JSON.stringify(req.body));
    res.send(JSON.stringify(req.body));
//    res.send('fucker  username is '+req.body['username']+" passwd "+req.body['password']+ " and he or she is "+req.body['age'] +" old");
}
//如果是Get,请使用query.argument来处理
exports.getregister = function(req,res){
    console.log(JSON.stringify(req.query.username));
    res.send('getfucker  username is: '+req.query.username+" And passwd: "+req.query.password+ " and he or she is: "+req.query.age +" old");
}