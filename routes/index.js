var express = require("express"),
	router = express.Router(),
	passport = require("passport"),
	User = require("../models/users");

// SIGNIN ROUTE
router.get("/register", function(req, res){
	res.render("auth/register");
})
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, newUser){
		if (err){
			req.flash("error", err.message);
			res.redirect("back");
		}
		else {
			passport.authenticate("local")(req, res, function(){
				req.flash("success", "Welcome to the Students Opinion Society, " + newUser.username)
				res.redirect("/");
			})
		}
	})
})

// LOGIN ROUTE
router.get("/login", function(req, res){
	res.render("auth/login");
})
router.post("/login", passport.authenticate("local", {
	successRedirect: "/",
	failureRedirect: "/login"
}),function(req, res){
	
})

// LOGOUT ROUTE
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged You Out")
	res.redirect("/");
})

module.exports = router;