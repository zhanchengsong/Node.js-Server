const express = require('express'); // import express once 
const bodyParser= require('body-parser') // uses body-parser
const MongoClient = require('mongodb').MongoClient //db client 
const mongoose = require("mongoose"); //get Mongoose 
User = require('./schema/user')
const port = 3000; //port to bind
const app = express(); // create a server instance
app.use(bodyParser.urlencoded({extended: true})); //support xml
app.use(bodyParser.json()); //support json

//Create DB connection
mongoose.connect('mongodb://serveradmin:DWgJCr3n@ds157639.mlab.com:57639/zhanchengtest');
var appdb = mongoose.connection;
appdb.on("error", console.error.bind(console, "connection error"));
appdb.once("open", function(callback) {
    console.log("Database connection successful");
    app.listen(port);//enalbe listening
    console.log("Server listening on port :"+port);
});
//default route 
app.get('/', function (req, res) {
    res.send('<h1>Hello World!</h1>')
  })
//Adds the authentication posing route 
app.post('/register', function(req,res){
    if (req.body.username && 
        req.body.email &&
        req.body.password &&
        req.body.passwordConfirm){
            
        //Create the data object 
            var userData = {
                email: req.body.email,
                username: req.body.username,
                password: req.body.password,
                passwordConf: req.body.passwordConfirm,
              }
              //Create user based on shcema
              User.create(userData, function (err, user) {
                if (err) {
                  res.status(409); 
                  return res.send(err);
                } else {
                  user.save(function(err){
                    if(err) {
                        res.status(500);
                        return res.send(err);
                    }
                    else {res.status(200);
                        //TODO: need to return tokens
                        return res.send("Successful registration");
                        }
                  });
                  
                }
              });
    }

    else {
        res.status(400);
        res.send("Missing field for registration");
    }
    
    
});




