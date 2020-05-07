var express = require("express"),
	router = express.Router(),
	Comment = require("../models/comments.js"),
	Blog    = require("../models/blogs.js"),
	middleware = require("../middleware/index.js");

// CREATE ROUTE
router.post("/blogs/:id/comments",middleware.isLoggedIn, function(req, res){
	
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
					newComment.author.id = req.user._id;
					newComment.author.username = req.user.username;
					newComment.save();
					blog.comments.push(newComment);
					blog.save();
					res.redirect("/blogs/" + req.params.id);
				}
			})
		}
	})
})


module.exports = router;



