
/*
 * GET users listing.
 */
"use strict";
//引入model下面的user
var userDBModel = require('../models/userinfo.js');
var crypt = require('../utils/crypt.js');
var user =new userDBModel.Schema("users").model;
exports.login = function (req, res, next) {
    res.render('login.html',{message:""});
};
exports.onLogin = function (req, res, next) {
    var mdPassword=crypt.md5(req.body.password);
    var queryObj = {userName:req.body.userName,password:mdPassword};
    user.findOne(queryObj,function(err,userInfo){
        if(err){
            res.send({message:"登陆失败！"});
        }else{
            if(userInfo){
                res.send({message:"登录成功"})
            }else{
                res.send({message:"用户名和密码错误！"});
            }
        }
    })
};
exports.addUser = function (){
    var userEntity = new user();
    userEntity.userName=req.body.userName;
    userEntity.password=req.body.password;
    userEntity.save(function (err,userInfo){

    })
};

exports.userList=function(req, res, next){
    user.find({},function(err,userList){
        //res.render('./user/users.html',{userList:userList});

    });

};

exports.userManager = function (req,res,next){

};
exports.list = function(req, res){
  res.send("respond with a resource");
};