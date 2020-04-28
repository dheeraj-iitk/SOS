/*var middleWareObj = {};

middleWareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated){
		return next();
	}
	req.flash("error", "You need to be logged in to do that")
	res.redirect("/login")
}

module.exports = middleWareObj;*/
/*var express=require("express");
var app=express();
const passport=require("passport")
const LocalStrategy=require("passport-local").Strategy
const User=require("../models/users");
const mongoose=require("mongoose");
const bcrypt=require("bcrypt");

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

require("../app")


module.exports=function(passport){
passport.use("local-login",
new LocalStrategy(function(username,password,done){
	User.findOne({username:username},function(err,user){
		if(err){
			console.log(err+"chiill h");
			return done(err);
		}
		else if(!user){
			console.log(username+"ok");
			return done(null,false)

		}

		else {
			console.log(user.hash);
			return done(null,user);
			
		}

	})
}
))
passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });
}*/

