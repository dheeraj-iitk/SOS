var express = require("express"),
	router = express.Router(),
	passport = require("passport"),
	User = require("../models/users");

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'sosatiitk@gmail.com',
        pass: 'sosblg2021'
    }
});
var userEmail;
var veruserEmail;
// SIGNIN ROUTE
router.get("/verify_email",function(req,res){
	res.render("auth/send_email");
})
router.post("/verify_email",function(req,res){
	rand=Math.floor((Math.random() * 100) + 54);
    host=req.get('host');
	link="http://"+req.get('host')+"/verify?id="+rand;
	User.find({email:req.body.email}, function(err, data){
		if (data.toString()!=0){
			req.flash("error", "this email has already been registered");
			res.redirect("/verify_email");
		}
		else {
			transporter.sendMail({
				from: 'sosatiitk@gmail.com',
				  to: req.body.email,
				  subject : "Please confirm your Email account",
				  html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
			},function(err,data){
				if(!err) {
					User.find({email:req.body.email},function(err,data){
						if(data.toString().length!=0){
							req.flash("error", "this email has already been registered" )
							res.redirect("/verify_email");
						}
						else{
							console.log("email.sent");
							req.flash("success", "Check your Email" )
							res.redirect("/verify_email");
							userEmail=req.body.email;
						}
					})
				}
				else {
					console.log(err);
					req.flash("error","Email given is not correct");
					res.redirect("/verify_email");
				}             
			});
		}
	})
})

router.get('/verify',function(req,res){
	console.log(req.protocol+":/"+req.get('host'));
	if((req.protocol+"://"+req.get('host'))==("http://"+host))
	{
		console.log("Domain is matched. Information is from Authentic email");
		if(req.query.id==rand)
		{
			console.log("email is verified");
			veruserEmail=userEmail;
				res.render("auth/register");
		
			//res.end("<h1>Email "+mailOptions.to+" is been Successfully verified");
		}
		else
		{
			console.log(rand+" "+req.query.id)
			console.log("email is not verified");
			res.end("<h1>Bad Request</h1>");
		}
	}
	else
	{
		res.end("<h1>Request is from unknown source");
	}
	});

router.post("/register", function(req, res){
	newUser = new User({email:veruserEmail,username: req.body.username, passcode: req.body.passcode});
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