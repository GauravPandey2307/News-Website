
const express = require('express')
const axios = require('axios')
const newsr=express.Router()
const moment = require('moment')
const math = require('math')
const mongoose = require("mongoose");
const cookieparse = require("cookie-parser");
const bcrypt=require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/model.js");

newsr.get("/login",(req,res)=>{
    res.render("login");
})

newsr.get("/register",(req,res)=>{
    res.render("register");
})

const isAuthenticated = (req,res,next)=>{
    const token = req.cookies ? req.cookies.token : null;
    //redirect
    if (!token) {
      return res.redirect("/login");
    }
    //Verify the token
    jwt.verify(token, "anykey", (err, decoded) => {
      if (err) return res.redirect("/login");
      //Add the user into the req obj
      //req.userData = decoded;
      next();
    });

}
newsr.get("/",(req,res)=>{
    
    res.render("home");
})
newsr.post("/login",async (req,res)=>{
    const {userName,password} = req.body;
    //console.log(userName+password);
    const userFound = await User.findOne({userName});
   // console.log(userFound);
    if(userFound &&(await bcrypt.compare(password,userFound.password)))
    {
        const token = jwt.sign({
            userName : userFound.userName,
            
        },"anykey",{
            expiresIn : "3d",
        });
        res.cookie("token",token,{
            maxAge:3*24*60*60*1000,
            httpOnly:true,
            
        });
        res.redirect("/news");

    }
    else
    {
        console.log("login failed");
        res.redirect("/login");
    }


});
newsr.post("/register",async (req,res)=>{
    const {userName,password} = req.body;
    const hashedpassword = await bcrypt.hash(password,10);
    await User.create({userName:userName,password:hashedpassword});
    console.log("User created successfully");
    res.redirect("/login");
})
newsr.get('/news',isAuthenticated,async(req,res)=>{
    try {
        var url = 'http://newsapi.org/v2/top-headlines?' +
          'country=in&' +
          'apiKey=36f3e29b704f41339af8439dc1228334';

        const news_get =await axios.get(url)
        res.render('news',{articles:news_get.data.articles})
        //console.log(news_get.data.articles);

    } catch (error) {
        if(error.response){
            console.log(error)
        }

    }
})

newsr.post('/search',isAuthenticated,async(req,res)=>{
    const search=req.body.search
    //console.log(req.body.search)


    try {
        var url = `http://newsapi.org/v2/everything?q=${search}&apiKey=36f3e29b704f41339af8439dc1228334`

        const news_get =await axios.get(url)
        res.render('news',{articles:news_get.data.articles})





    } catch (error) {
        if(error.response){
            console.log(error)
        }

    }
})

newsr.get('/news/:category',isAuthenticated,async(req,res)=>{
    var category = req.params.category;
    try {
        var url = 'http://newsapi.org/v2/top-headlines?country=in&category=' + category + '&apiKey=36f3e29b704f41339af8439dc1228334';

        const news_get =await axios.get(url)
        res.render('category',{articles:news_get.data.articles})

    } catch (error) {
        if(error.response){
            console.log(error)
        }

    }
})


module.exports=newsr