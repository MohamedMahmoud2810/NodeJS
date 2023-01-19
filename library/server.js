const express = require ("express");
const app = express();
const bodyParser = require("body-parser");
const bodyParserForm = bodyParser.urlencoded();
const { application } = require("express");
const fs = require("fs");
const { json } = require("body-parser");

let settings = {
    codeCounter : 1
}

let books = [
    
]

app.set("view engine" , "ejs");

//display all contacts
app.get("/allbooks",function(req,res){

    let fbooks = books;
    if(req.query.q){
        fbooks= books.filter(book=>book.name.indexOf(req.query.q)>-1 || book.author.indexOf(req.query.q)>-1)
    }
    
    res.render("allbooks.ejs",{q:req.query.q,fbooks});
})



//add new contact

app.get("/addbook",function(req,res){
    res.render("addbook.ejs");
})
app.post("/allbooks",bodyParserForm,function (req,res) {
    req.body.code = settings.codeCounter++;

    books.push(req.body);  
    saveDataToFile();

    res.render("redirect.ejs");
})



//update book
app.get("/updatebook",function(req,res){

    let book = books.find(book =>book.code== req.query.code); 
    res.render("updatebook.ejs",{book});
})

app.post("/updatebook" , bodyParserForm , function(req,res){
    
    //find items that match the code 
    let book = books.find(book=>book.code == req.body.code);

    //update item
    book.name = req.body.name;
    book.author = req.body.author;
    saveDataToFile();
    res.render("redirect.ejs");
})


//delete book
app.get("/deletebook" , function(req,res){
    //find items that match the code 
    let bookIndex = books.findIndex(book=>book.code == req.query.code);
    books.splice(bookIndex,1);
    saveDataToFile();
    res.render("redirect.ejs");
    
})


//saveing
function saveDataToFile(){
    fs.writeFile("books.db" , JSON.stringify(books) , function(err){
        if(err){
            console.log(err);
        }
    });
    fs.writeFile("settings.db" , JSON.stringify(settings) , function(err){
        if(err){
            console.log(err);
        }
    });
};

function loadDataToFile(){
    fs.readFile("books.db" , function(err,data){
        if(err){
            console.log(err);
        }else{
            books = JSON.parse(data);
        }

    })
    fs.readFile("settings.db" , function(err,data){
        if(err){
            console.log(err);
        }else{
            settings = JSON.parse(data);
        }

    })
}

loadDataToFile();
app.listen(8080);