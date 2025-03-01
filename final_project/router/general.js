const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
  //return res.status(300).json({message: "Yet to be implemented"});
});


// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.get('/', async (req, res) => {
    try {
        return res.status(200).json({ books: books });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books" });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.status(200).json({ book: books[isbn] });
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});
  
// Get book details based on author
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author;

    let filteredBooks = Object.entries(books)
        .filter(([key, book]) => book.author.toLowerCase() === author.toLowerCase())
        .map(([key, book]) => ({ isbn: key, ...book }));

    if (filteredBooks.length > 0) {
        return res.status(200).json({ books: filteredBooks });
    } else {
        return res.status(404).json({ message: "No books found for this author" });
    }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;

    let filteredBooks = Object.entries(books)
        .filter(([key, book]) => book.title.toLowerCase() === title.toLowerCase())
        .map(([key, book]) => ({ isbn: key, ...book }));

    if (filteredBooks.length > 0) {
        return res.status(200).json({ books: filteredBooks });
    } else {
        return res.status(404).json({ message: "No books found with this title" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
   const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json({ reviews: books[isbn].reviews || "No reviews yet" });
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
