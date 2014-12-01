
/*
 * GET users listing.
 */
"use strict";
var userDBModel = require('../models/user.js');
var crypt = require('../utils/crypt.js');
var validator = require('validator');
var mail = require('../common/mail');
var tools = require('../common/tools');
var utility = require('utility');
var config = require('../config');
var user =new userDBModel.Schema("user").model;
exports.login = function (req, res, next) {
    res.render('login.html',{message:""});
};
/*
 * 用户登录接口，根据用户名和密码进行校验
 */
exports.onLogin = function (req, res, next) {
    var mdPassword=crypt.md5(req.body['password']);
    var queryObj = {userName:req.body['username'],password:mdPassword};
    console.log("queryObj "+queryObj)
    user.findOne(queryObj,function(err,userInfo){
        if(err){
            res.send('message:登陆失败');
        }else{
            if(userInfo){
                user.update({userName:req.body['username']},{$set:{online:true,update_at:new Date()}},function(err,updateinfo){
               if(err)
               {
                   res.send('message:登陆失败');
               }else{
                   if(updateinfo)
                   {
                       res.send('message:登录成功222');
                   }else{
                       res.send('message:用户名或者密码错误');
                   }
               }
            })
            }else{
                res.send('message:用户名或者密码错误');
            }
        }
    })
    console.log(req.body);
};
exports.userList=function(req, res, next){
    user.find({},function(err,userList){
        res.render('./user/users.html',{userList:userList});

    });

};
exports.userManager = function (req,res,next){

};

exports.list = function(req, res){
  res.send("respond with a resource");
};
/**
 * //如果是Post 请使用req.body['argument']来处理数据 参考 https://cnodejs.org/topic/50a333d7637ffa4155c62ddb
 * 用户注册接口,注册之前 检测是否已经注册
**/
exports.getUsersByQuery = function (query, opt, callback) {
    user.find(query, '', opt, callback);
};
//{'$or
exports.register=function(req,res){
    user.find({'$or': [
        {'userName':req.body['username']},
        { 'email':req.body['email']}
    ]}, {}, function (err, users) {
        if (err) {
            return next(err);
        }
        if (users.length > 0) {
            res.send('用户名或者邮箱已经注册');
            return;
        }else{
//是新用户
            var username = validator.trim(req.body['username']).toLowerCase();
            var email = validator.trim(req.body['email']).toLowerCase();
            var pass = validator.trim(req.body['password']);
            var rePass = validator.trim(req.body['password']);

            // 验证信息的正确性
            if ([username, pass, rePass, email].some(function (item) { return item === ''; })) {
                res.send('信息不完整');
                return;
            }
            if (username.length < 5) {
                res.send('用户名至少需要5个字符。');
                return;
            }
            if (!tools.validateId(username)) {
                res.send('用户名不合法。');
                return;
            }
            if (!validator.isEmail(email)) {
                res.send('邮箱不合法。');
                return;
            }
            if (pass !== rePass) {
                res.send('两次密码输入不一致。');
                return;
            }
        var userEntity = new user();
        userEntity.userName=req.body['username'];
        userEntity.password=crypt.md5(req.body['password']);
        userEntity.email = req.body['email'];
        userEntity.nickname = req.body['nickname'];
        userEntity.sex = req.body['sex'];
        userEntity.profession = req.body['profession'];
        userEntity.location = req.body['location'];
        userEntity.save(function (err,userInfo){
        console.log("save..................... "+err);
        if(!err) {
            //console.log(userEntity);
            // 发送激活邮件
            var tokenstr = utility.md5(email + pass + config.session_secret);
            //mail.sendActiveMail(email,tokenstr , username);
            console.log("sendActiveMail "+username+" "+pass+" tokenstr is "+tokenstr);
            res.send('Register information..success........'+userInfo);
        }else{
            res.send('Register information..error........'+userInfo);
        }
    })}
    });
    //console.log(req.body);
};
//如果是Get,请使用query.argument来处理
exports.getregister = function(req,res){
    console.log(JSON.stringify(req.query.username));
    res.send('getfucker  username is: '+req.query.username+" And passwd: "+req.query.password+ " and he or she is: "+req.query.age +" old");
}

//账号激活
exports.active_account = function (req, res, next) {
    console.log("账号激活 "+req.query.key );
    var key = req.query.key;
    var name = req.query.name;
    user.find({'$or': [{userName:name}]}, {}, function (err, users){
        if (err) {
            console.log("error "+err.message );
            return next(err);
        }
        console.log("key "+key+"-------------------"+name);
        if(name =='undefined')
        {
            console.log("信息有误，帐号无法被激活")
            return res.render('notify/notify', {error: '信息有误，帐号无法被激活。'});
        }
        var passhash = user.password;
        console.log("passwd "+passhash+" "+user.username+" "+user.email);
        if (!user || utility.md5(user.email + passhash + config.session_secret) !== key) {
//            return res.render('notify/notify', {error: '信息有误，帐号无法被激活。'});
            console.log("信息有误，帐号无法被激活2")
            return res.redirect('/');
        }
        if (user.active) {
            console.log("帐号被激活");
            return res.redirect('/');
        }
        user.active = true;
        user.save(function (err) {
            if (err) {
                return next(err);
            };
            var msg = '帐号已被激活,请登录'
            console.log("帐号已被激活,请登录");
            return res.redirect('/home');
        });
    });
};