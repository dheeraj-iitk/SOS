var express = require("express"),
	router = express.Router(),
	Comment = require("../models/comments.js"),
	Blog    = require("../models/blogs.js");

// CREATE ROUTE
router.post("/:id/comments",isLoggedIn, function(req, res){
	
	Blog.findById(req.params.id, function(err, blog){
		if(err){
			console.log("error finding Blog create comment");
		}
		else{
			Comment.create(req.body.comment, function(err, newComment){
				if(err){
					console.log("error creating comment");
				}
				else {
					blog.comments.push(newComment);
					blog.save();
					res.redirect("/" + req.params.id);
				}
			})
		}
	})
})

function isLoggedIn(req, res, next){
	if(req.isAuthenticated){
		next();
	}else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("/login");
	}
	
}

module.exports = router;



