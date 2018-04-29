const express = require('express'); // import express once 
const bodyParser= require('body-parser') // uses body-parser
const MongoClient = require('mongodb').MongoClient //db client 
const mongoose = require("mongoose"); //get Mongoose 
const bcrypt = require('bcrypt');// Hash tool
const port = 3000; //port to bind
const app = express(); // create a server instance
const jwt = require('jsonwebtoken');

User = require('./schema/user') // user data schema
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
            var userDoc = new User ({
                email: req.body.email,
                username: req.body.username,
                password: req.body.password,
                passwordConf: req.body.passwordConfirm,
              })
              //Create user based on shcema
              //use schema.create to insert data into the db
            userDoc.save(function(err){
                if (err) {
                    res.status(409);
                    res.send("Failed to save user " + err);
                }
                else {
                    res.status(200);
                    res.send("Registration successful");
                }
            })
    }

    else {
        res.status(400);
        res.send("Missing field for registration");
    }
    
});
app.post('/auth',function(req,res){
    if (req.body.username && req.body.password){
        //Find the user by username
        User.findOne({
            username: req.body.username
        }, function(err,user){
            //if error:
            if (err) {
            res.status(403);
            res.send(err);}
            else {
                if (!user) {
                    res.status(404)
                    res.json({ success: false, message: 'Authentication failed. User not found.' });
                  } else if (user) {
                    bcrypt.compare(req.body.password, user.password, function (err, isSame) {
                        if (err) { 
                            res.status(500);
                            res.send(err);
                
                        }
                        else { //TODO : Replace diet4coke with proper secret
                            if (isSame){
                            var authToken = jwt.sign(req.body.username, "diet4coke",{
                               // expiresInMinutes: 1440
                            });
                            res.status(200);
                            res.json({success: true, authToken: authToken})   
                            }   
                            else {
                                res.status(401);
                                res.json({success: false, error: "User Authentication failed"})
                            } 
                        }   
                    });
                   
                  }
            }
        })
    }else {
        res.status("404");
        res.send("Username/password missing");
    }

});






