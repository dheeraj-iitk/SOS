var express = require("express"),
	router = express.Router(),
	Blog    = require("../models/blogs"),
	User = require("../models/users"),
	middleware = require("../middleware");

// LANDING ROUTE
router.get("/",function(req,res){
	res.render("blogs/home");
})

// INDEX ROUTE
router.get("/blogs", function(req, res){
	
	Blog.find({}, function(err, allBlogs){
		if(err){
			console.log("Error in finding blogs in index");
		}
		else {
			if (req.isAuthenticated()){
				User.findById(req.user._id, function(err, user){
					if(err){
						req.flash("error", "User not found");
						res.redirect("/");
					}
					else {
						res.render("blogs/index", {blogs: allBlogs, user: user});
					}
				})
			}
			else {
				res.render("blogs/index", {blogs: allBlogs});
			}	
		}
	})
})
// NEW ROUTE
router.get("/blogs/new", middleware.isLoggedIn , function(req, res){
	res.render("blogs/new");
})
// CREATE ROUTE
router.post("/blogs", function(req, res){
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			console.log("error creating new post");
		}
		else{
			newBlog.author.id = req.user._id;
			newBlog.author.username = req.user.username;
			newBlog.save();
			res.redirect("/blogs");
		}
	})
})
// SHOW ROUTE
router.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id).populate("comments").exec(function(err, showBlog){
		if(err){
			console.log(err)
		}
		else {
			Blog.find({},function(err,allBlogs){
				if(err){
					req.flash("error", "Blogs not found");
					res.redirect("back");
				}
				else{
					res.render("blogs/show", {blog: showBlog, allblog: allBlogs});
				}
			})
		}
	})
})
// EDIT ROUTE
router.get("/blogs/:id/edit",middleware.checkBlogOwnership, function(req, res){
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
router.put("/blogs/:id",middleware.checkBlogOwnership, function(req, res){
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			console.log("error in finding and updating blog");
		}
		else{
			res.redirect("/blogs/" + req.params.id);
		}
	})
})
// REMOVE ROUTE
router.delete("/blogs/:id",middleware.checkBlogOwnership, function(req, res){
	Blog.findByIdAndRemove(req.params.id, function(err, deletedBlog){
		if(err){
			console.log("error finding and deleting blog");
		}
		else{
			res.redirect("/blogs");
		}
	})
})


module.exports = router;