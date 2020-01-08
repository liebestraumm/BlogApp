var express = require("express");
var app = express();
var body = require("body-parser");
var mongoose = require("mongoose");

app.set("view engine", "ejs");
app.use(body.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(express.static("images"));
app.use(express.static("semantic"));

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

app.get(/\/[a-zA-Z]*/, function(req, res){

	res.redirect("/blogs");
});

app.listen(3000, function(){
	console.log("Server Started");

});