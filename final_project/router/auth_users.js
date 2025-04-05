const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const {userName, password} = req.body;
    const user = users.find(user => user.userName===userName && user.password===password);
    if(user){
        const token = jwt.sign(
            { userName: user.userName },
            'access',
            {expiresIn: '1hr'}
        );
        res.status(200).json({token});
    }else{
        res.status(401).json({error:"Invalid user"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Authorization token missing or malformed" });
    }
    const token = authHeader.split(" ")[1];
    if (!review) {
        return res.status(400).json({ error: "Review query is required" });
    }
    try{
        const decoded = jwt.verify(token, 'access');
        const userName = decoded.userName;
        if(books[isbn]){
            books[isbn].reviews[userName]=review;
            return res.status(200).send("Review added/updated successfully")
        }else{
            return res.status(404).json({error: "book not found"})
        }
    }catch(err){
        return res.status(403).json({ error: "Invalid or expired token" });        
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Authorization token missing or malformed" });
    }
    const token = authHeader.split(" ")[1];
    try{
        const decoded = jwt.verify(token, 'access');
        const userName = decoded.userName;
        if(books[isbn]){
            delete books[isbn].reviews[userName];
            return res.status(200).send("Review deleted successfully")
        }else{
            return res.status(404).json({error: "book not found"})
        }
    }catch(err){
        return res.status(403).json({ error: "Invalid or expired token" });        
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
