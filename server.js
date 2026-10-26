require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

//
//var db, collection;

//URL from MongoDB or Mongo Atlas
//will only allow 1 IP Address to connect to this (setting in security - Databse)
//const url = "mongodb+srv://carlyjjohnson2_db_user:nLi5bwLh7BnXhDXC@cluster0.8markv7.mongodb.net/";
// const dbName = "demo";
const url = process.env.MONGODB_URI; 
const dbName = process.env.DB_NAME; 

//connect to server and listen
//start the server 
//connect to MongoDB - url + what you need to connect
//the call back function (parameters - error)
app.listen(3000, () => {//code to connect to Mondo Databse (using client package)
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);//tells it which database to connect to
        console.log("Connected to `" + dbName + "`!");
    });
});

//template that gets turned into raw HTML (name is plugged in )
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true})) //look at all the data from requests (helpful with submitting forms)
app.use(bodyParser.json())
app.use(express.static('public')) //static files will be hosted with this - don't have to build custom routes

//API IS HERE - URL is the light switch to turn it ON
//Different TYPES OF REQUESTS - GET, POST, PUT, DELETE
//GET Request on the Main Page
//THE ROUTE IS the Interface - WEB API is the combination of the different types of request
app.get('/', (req, res) => {
  db.collection('messages').find().toArray((err, result) => {
    if (err) return console.log(err)
      console.log('saved to databse')
    res.render('index.ejs', {messages: result})//responds with HTML file
  })
})

//Go to database, go to messages collection, find documents and turn it into an array
//collection is made up of documents
//wherever you see 'result' - it's going to be the array of documents

//creates a new document that goes into the database
app.post('/messages', (req, res) => {
  db.collection('messages').insertOne({name: req.body.name, msg: req.body.msg, thumbUp: 0, thumbDown:0}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

//PUT 
app.put('/messages', (req, res) => {
  db.collection('messages')
  .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
    $set: { 
      thumbUp: req.body.thumbUp - 1
    }
  }, { 
    sort: {_id: -1}, 
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})
    

//DELETE
app.delete('/messages', (req, res) => {
  db.collection('messages').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})


//index.ejs is NOT an HTML - it's a rendering of an HTML file
//get messages from the the databse - sotred in an array and pass it throuigh the ejs file
//message is the ARRAY
//message.length - the # of documents
//each time the for loop runs 
  //message 0 - gives the first message 


//ARRAY gets called Messages in EJS
//Messages is an object 
//EJS can take in an object 

//fetch is a PUT with Down Route (subtract one from thumbs up)

//


