var express = require("express");
var app = express();
var body = require("body-parser");
var mongoose = require("mongoose");
var method = require("method-override");
var es = require("express-sanitizer");

app.set("view engine", "ejs");
app.use(body.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(express.static("images"));
app.use(express.static("semantic"));
app.use(method("_method"));
app.use(es());

mongoose.connect("mongodb://localhost:27017/blogdb", {useUnifiedTopology: true, useNewUrlParser: true});

var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});

var Blogs = mongoose.model("Bloge", blogSchema);

app.get("/blogs", function(req, res){

	Blogs.find({}, function(error, blogs){

		if(error)
			console.log("Error: " + error)
		else{
			res.render("index", {blogs:blogs});
		}
	})
});

app.post("/blogs", function(req, res){
	req.body.bloges.body = req.sanitize(req.body.bloges.body);
	Blogs.create(req.body.bloges, function(error, dbblog){
		if(error){
			console.log(error);
		}
		else{
			res.redirect("/blogs");
		}

	});
});

app.get("/blogs/new", function(req, res){
	res.render("new");

});

app.get("/blogs/:id/edit", function(req, res){
	Blogs.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.render("edit", {blogs:foundBlog});
		}

	});

});

app.get("/blogs/:id", function(req, res){
	Blogs.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs/new");
			console.log(err);
		}
		else
		{
			res.render("show", {blogs: foundBlog})
		}
	});
});

app.put("/blogs/:id", function(req, res){
	req.body.bloges.body = req.sanitize(req.body.bloges.body);
	Blogs.findByIdAndUpdate(req.params.id, req.body.bloges, function(err, foundBlog){
		if(err){
			res.send(err);
		}
		else{
			res.redirect("/blogs/" + req.params.id);
		}

	});

});

app.delete("/blogs/:id", function(req,res){
	Blogs.findByIdAndRemove(req.params.id, function(error, deleted){
		if(error){
			console.log("Error!");
		}

		else{
			res.redirect("/blogs");
		}

	});

});

app.get(/\/[a-zA-Z]*/, function(req, res){

	res.redirect("/blogs");
});

app.listen(3000, function(){
	console.log("Server Started");

});