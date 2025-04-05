const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
    let {userName, password} = req.body;
    try{
        if(!userName || !password){
            throw new Error ("Enter a valid username and password");
        }
        let exist = users.find(user=>user.userName===userName);
        if(!exist){
            const user = {
                userName:`${userName}`,
                password:`${password}`
            }
            users.push(user);
            res.status(200).send("New User registered");
        }
        res.status(404).send("User already registered")
    }catch(err){
        res.status(400).json({error: err.message});
    }
});

public_users.get('/books', (req, res) => {
    res.status(200).json(books);
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
    try {
        const books = await axios.get('https://localhost:5000/books');
        res.status(200).json(books.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books", error: error.message });
    }
});

// Get book details based on ISBN
public_users.get('/books/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    if(books[isbn]){
        res.status(200).json(books[isbn]);
    }else{
        res.status(404).json({message:"isbn not found"});
    }
});

public_users.get('/isbn/:isbn',async function (req, res) {
    try {
        const isbn = req.params.isbn;
        const books = await axios.get(`https://localhost:5000/books/isbn/${isbn}`);
        res.status(200).json(books.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching isbn", error: error.message });
    }
});
  
// Get book details based on author
public_users.get('/books/author/:author',function (req, res) {
    let author = req.params.author;
    let details = Object.values(books).filter((book)=> book.author===author);
    if(details.length>0){
        res.status(200).json(details);
    }else{
        res.status(404).json({message:"author not found"});
    }
});

public_users.get('/author/:author',async function (req, res) {
    try {
        const author = req.params.author;
        const books = await axios.get(`https://localhost:5000/books/author/${author}`);
        res.status(200).json(books.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching author", error: error.message });
    }
});



// Get all books based on title
public_users.get('/books/title/:title',function (req, res) {
    let title = req.params.title;
    let details = Object.values(books).filter((book)=> book.title===title);
    if(details.length>0){
        res.status(200).json(details);
    }else{
        res.status(404).json({message:"title not found"});
    }
});

public_users.get('/title/:title',async function (req, res) {
    try {
        const title = req.params.title;
        const books = await axios.get(`https://localhost:5000/books/title/${title}`);
        res.status(200).json(books.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching title", error: error.message });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    let book = books[isbn];
    if(book && book["reviews"]){
        res.status(200).send(book["reviews"]);
    }else{
        res.status(404).json({message:"isbn not found"});
    }
});

module.exports.general = public_users;
