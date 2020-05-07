var express = require("express"),
	mongoose = require("mongoose"),
	bodyParser = require("body-parser"),
	methodOverride = require("method-override"),
	passport = require("passport"),
	localStrategy = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	Blog    = require("./models/blogs"),
	Comment = require("./models/comments"),
	User    = require("./models/users"),
	flash = require("connect-flash"),
	app 	= express();

var blogRoutes = require("./routes/blogs.js"),
	commentRoutes = require("./routes/comments.js"),
	indexRoutes = require("./routes/index.js");

// MONGOOSE CONFIGURATION
mongoose.connect("mongodb://localhost:27017/society", {useNewUrlParser: true, useUnifiedTopology: true});

// APP CONFIGURATION
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"))

// AUTHENTICATION CONFIGURATION
app.use(require("express-session")({
	secret: "I am amazing",
	resave: false,
	saveUninitialized: false
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// FLASH CONFIGURATION
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	res.locals.passVal = "sosblg2021";
	next();
})

// ROUTES
app.use(indexRoutes);
app.use(blogRoutes);
app.use(commentRoutes);

app.listen(3000, function(){
	console.log("Blog has started");
})