const express = require('express'); // import express once 
const bodyParser= require('body-parser') // uses body-parser
const MongoClient = require('mongodb').MongoClient //db client 
User = require('./schema/user')
const port = 3000; //port to bind
const app = express(); // create a server instance
app.use(bodyParser.urlencoded({extended: true}));
var appdb
MongoClient.connect('', (err, client) => {
    if (err) return console.log(err)
    appdb = client.db('zhanchengtest') // whatever your database name is
    app.listen(port, function () {
        console.log("Server is running on "+ port +" port");
    }); //Starts the server and listen on the port 
})
//default route 
app.get('/', function (req, res) {
    res.send('<h1>Hello World!</h1>')
  })
//Adds the authentication posing route 
app.post('/register', function(req,res){
    if (req.body.email &&
        req.body.username &&
        req.body.password &&
        req.body.passwordConf) {
        console.log("Received all data");
        var userData = {
          email: req.body.email,
          username: req.body.username,
          password: req.body.password,
          passwordConf: req.body.passwordConf,
        }
        //use schema.create to insert data into the db
        User.create(userData, function (err, user) {
          if (err) {
            res.send(err);
          } else {
              appdb.collection('users').save(user,function(err,result){
                if (err) {
                    return console.log(err)}
                else {
                    console.log(result);
                    res.sendStatus(200);
                }    
              });
          }
        });
    }else { //if not all the parameters are provided
        res.sendStatus(400);
    }
});




