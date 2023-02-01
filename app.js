const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");
mongoose.set("strictQuery",false);
mongoose.connect("mongodb+srv://admin-kishore:Test123@cluster0.yhnco9i.mongodb.net/wikiDB");
const articleSchema = new mongoose.Schema({
    title:String,
    content:String
})
const Article = mongoose.model("Article",articleSchema);
//// Request for all Articles
app.route("/articles").get((req,res)=>{
    Article.find((err,foundArticles)=>{
        if(err){
            console.log(err);
        }else{
            res.send(foundArticles);
        }
    })
}).post((req,res)=>{
    const newArticle = new Article({
        title:req.body.title,
        content:req.body.content
    });
    newArticle.save((err)=>{
        if(!err){
            res.send("Succesfully added a new article");
        }else{
            res.send(err);
        }
    });
}).delete((req,res)=>{
    Article.deleteMany((err)=>{
        if (!err) {
            res.send("Deleted Successfully");
        } else {
            res.send(err);
        }
    })
});
////Request for specific article
app.route("/articles/:articleTitle").get((req,res)=>{
    Article.findOne({title:req.params.articleTitle},(err,foundArticle)=>{
        if(foundArticle){
            res.send(foundArticle);
        }else{
            res.send("No article matching that title was found");
        }
    })
}).put((req,res)=>{
    Article.updateOne({title:req.params.articleTitle}
        ,{title:req.body.title
        ,content:req.body.content},
        (err)=>{
            if(!err){
                res.send("Updated Successfully");
            }else{
                res.send(err);
            }
        })
}).patch((req,res)=>{
    Article.updateOne({title:req.params.articleTitle}
        ,{$set:req.body}
        ,(err)=>{
            if(!err){
                res.send("Succesfully Patched");
            }else{
                res.send(err);
            }
        })
}).delete((req,res)=>{
    Article.deleteOne({title:req.params.articleTitle},(err)=>{
        if(!err){
            res.send("Deleted Successfully");
        }else{
            res.send(err);
        }
    })
})
  

app.listen(process.env.PORT || 3000,()=>{
    console.log("Server started at port 3000.....");
})