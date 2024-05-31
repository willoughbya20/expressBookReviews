const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

const getAllBooks = () => {
    return books;
  };

const doesExist = (username) => {
    return users.some((user) => user.username === username);
  };

  public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
      return res.json({ message: "Missing username or password" });
    } else if (doesExist(username)) {
      return res.json({ message: "user already exists." });
    } else {
      users.push({ username: username, password: password });
      return res.json({ message: "User successfully registered.  Please login." });
    }
  });

// Get the book list available in the shop
public_users.get("/", async (req, res) => {
    const allBooks = await getAllBooks();
    res.send(JSON.stringify(allBooks, null, 10));
  });


// Get book details based on ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
    const targetISBN = parseInt(req.params.isbn);
    const targetBook = await books[targetISBN];
    if (!targetBook) {
      return res.json({ message: "ISBN not found." });
    } else {
      return res.json(targetBook);
    }
  });
  
// Get book details based on author
public_users.get("/author/:author", async (req, res) => {
    const matchingBooks = Object.values(await books).filter(
      (book) => book.author === req.params.author
    );
    if (matchingBooks.length > 0) {
      return res.send(JSON.stringify(matchingBooks, null, 10));
    } else {
      return res.json({ message: "No books by that author." });
    }
  });

// Get all books based on title
public_users.get('/title/:title',async (req, res)=> {
  //Write your code here
  const matchingTitle = Object.values(await books).filter(
    (book) => book.title === req.params.title
  );
  if (matchingTitle.length > 0) {
    return res.send(JSON.stringify(matchingTitle, null, 10));
  } else {
    return res.json({ message: "No books for that Title." });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const wantISBN = req.params.isbn;
  const wantBook = books[wantISBN];
  if (wantBook){
    return res.send(JSON.stringify(wantBook.reviews, null, 10))
  } else {
    return res.json({message: "No book matching the ISBN number"})
  }
});

module.exports.general = public_users;
