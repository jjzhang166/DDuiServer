
/*
 * GET users listing.
 */
"use strict";
var userDBModel = require('../models/user.js');
var crypt = require('../utils/crypt.js');
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
                res.send('message:登录成功');
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
function findUserByUsername(username)
{
    var queryObj = {userName:username};
    console.log("findUserByUsername "+queryObj+" "+username);
    user.findOne(queryObj,function(err,userInfo){
        if(err){
            return false;
        }else{
            if(userInfo){
                console.log("userInfo  "+userInfo)
                return true;
            }else{
                console.log("userInfo222  "+username)
                return false;
            }
        }
    })
}
/**
 * //如果是Post 请使用req.body['argument']来处理数据 参考 https://cnodejs.org/topic/50a333d7637ffa4155c62ddb
 * 用户注册接口,注册之前 检测是否已经注册
**/
exports.register=function(req,res){

    if(findUserByUsername(req.body['username'])){
        res.send('Register information-----------------repeater........');
    }else{
        var userEntity = new user();
        userEntity.userName=req.body['username'];
        userEntity.password=crypt.md5(req.body['password']);
        userEntity.email = req.body['email'];
        userEntity.nickname = req.body['nickname'];
        userEntity.sex = req.body['sex'];
        userEntity.profession = req.body['profession'];
        userEntity.location = req.body['location'];
        userEntity.save(function (err,userInfo){
        if(!err) {
            console.log(user.name);
            res.send('Register information..success........');
        }else{
            res.send('Register information..error........');
        }
    })
    }
    console.log(req.body);
};
//如果是Get,请使用query.argument来处理
exports.getregister = function(req,res){
    console.log(JSON.stringify(req.query.username));
    res.send('getfucker  username is: '+req.query.username+" And passwd: "+req.query.password+ " and he or she is: "+req.query.age +" old");
}