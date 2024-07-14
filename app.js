const cookieParser = require('cookie-parser');
const express = require('express')
const app=express()
const port = process.env.PORT||3000;
//const bodyParser = require('body-parser');
const moment = require('moment')
const mongoose = require("mongoose");
app.locals.moment = moment;
const connector= ()=>{
    try{
    mongoose.connect("mongodb://localhost:27017/newswebsite").then(()=>{console.log("database connected")}).catch((error)=>{console.log(error)});
    app.listen(port,()=>{console.log("Server is running")});
    }
    catch(error)
    {
        console.log(error+"error occurred");
    }
}
connector();
// template engine  
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.static('public'))
app.set('view engine','ejs')

app.use(express.urlencoded({ extended: true }));
app.use('/',require('./routes/news'));


