var Blog = require("../models/blogs");

var middlewareObj = {};

middlewareObj.checkBlogOwnership = function (req, res, next){
	if(req.isAuthenticated()){
		Blog.findById(req.params.id, function(err, blog){
			if(err){
				req.flash("error", "Blog not found")
				res.redirect("back");
			}
			else {
				if(blog.author.id.equals(req.user._id)){
					return next();
				}
				req.flash("error", "You dont have permission to do that");
				res.redirect("back");
			}	
		});
		
	}
	else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function (req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, comment){
			if(err){
				req.flash("error", "Comment not found")
				res.redirect("back");
			}
			else {
				if(comment.author.id.equals(req.user._id)){
					return next();
				}
				req.flash("error", "You dont have permission to do that");
				res.redirect("back");
			}
		})
	}
	else{
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function (req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to that");
	res.redirect("/login");
}

module.exports = middlewareObj;