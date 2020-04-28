var express = require("express"),
	router = express.Router(),
	Blog    = require("../models/blogs")
	var passport=require("passport");
	 // require("../middleware/index")(passport);

// INDEX ROUTE
router.get("/", function(req, res){
	
	Blog.find({}, function(err, allBlogs){
		if(err){
			console.log("Error in finding blogs in index");
		}
		else {
			res.render("blogs/index", {blogs: allBlogs});
		}
	})
})



// NEW ROUTE
router.get("/new", isLoggedIn , function(req, res){
	console.log(typeof(req.isAuthenticated));
	res.render("blogs/new");
})
// CREATE ROUTE
router.post("/", function(req, res){
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			console.log("error creating new post");
		}
		else{
			res.redirect("/");
		}
	})
})
// SHOW ROUTE
router.get("/:id", function(req, res){
	Blog.findById(req.params.id).populate("comments").exec(function(err, showBlog){
		if(err){
			console.log(err)
		}
		else {
			res.render("blogs/show", {blog: showBlog});
		}
	})
})
// EDIT ROUTE
router.get("/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, updateBlog){
		if(err){
			console.log("Error in finding blog in edit");
		}
		else {
			res.render("blogs/edit", {blog: updateBlog});
		}
	})
})
// UPDATE ROUTE
router.put("/:id", function(req, res){
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			console.log("error in finding and updating blog");
		}
		else{
			res.redirect("/" + req.params.id);
		}
	})
})
// REMOVE ROUTE
router.delete("/:id", function(req, res){
	Blog.findByIdAndRemove(req.params.id, function(err, deletedBlog){
		if(err){
			console.log("error finding and deleting blog");
		}
		else{
			res.redirect("/");
		}
	})
})
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that")
	res.redirect("/login")
}

module.exports = router;