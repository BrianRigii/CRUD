var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var cookieParser = require("cookie-parser")
var session = require("express-session")
port = 3030;

var app = express()

mongoose.connect("mongodb://localhost/api_db",(err,db)=>{
    console.log("database connected")
})
app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use(session({secret:"its a secret"}))
app.set('views',"./views");
app.set("view engine", "pug");

app.get("/",(req,res)=>{
    res.render("form")
})

// mongoose schema 

personSchema = mongoose.Schema({
    userName : String,
    pwd : Number,
    status : String
})

var user = mongoose.model("user",personSchema)

// saving document

app.post("/submit",(req,res)=>{
    personInfo = req.body;
    console.log(personInfo)

    var users = new user({
        userName : personInfo.name,
        pwd: personInfo.pwd,
        status : personInfo.status

        
    })
    console.log(users.pwd)

    users.save((err,users)=>{
        if(err){
            console.log(err)
        }
        
        else{  console.log("new user alert " + users)   }
    })
    res.send("request recieved")
})

// finding a document 
app.get("/users/:id",(req,res)=>{
    user.findById(req.params.id,(err,response)=>{
        res.json(response)
        console.log(`looking for ${response.userName} ??`)
    })
})

// deleting
app.delete("/users/:id",(req,res)=>{
    user.findByIdAndRemove(req.params.id,(err,response)=>{
        if(err){
            console.log(`an error occured deleting user`)
        }
        else{
            console.log(`${response.userName} succesfully deleted`)
            res.send(`deleted ${response.userName} `)
        }
    })

})

// updating
app.get("/update/:id",(req,res)=>{
    user.findByIdAndUpdate(req.params.id ,{status :"Active"},(err,response)=>{
        if(err){
            console.log(`something wrong happened ${err}`)
        }
        else{console.log(`${response.userName} is now active`)
        res.send(`${response.userName} is now active`)}
    })
})

// cookies

app.get("/cookie",(req,res)=>{
    res.cookie("name","logged in").send("sent you a cookie")
})

app.get("/sessions",(req,res)=>{
    if(req.session.page_views){
        req.session.page_views++;
        res.send(`you have visited this page ${req.session.page_views} times`)
    }
    else{
        req.session.page_views = 1
        res.send("welcome to this page")
    }

   
})







// starts server
app.listen(port,function(){
    console.log("listening on port " + port)
})