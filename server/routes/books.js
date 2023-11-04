// Required modules for routing
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Import the book model from 'models' directory
const books = require('../models/books');

/* GET books List page. READ */
router.get('/', (req, res, next) => {
  // Retrieve all books from the 'books' collection
  books.find((err, books) => {
    if (err) {
      return console.error(err);
    } else {
      res.render('books/index', {
        title: 'Books',
        books: books
      });
    }
  });
});

// GET the Book Details page to add a new Book
router.get('/add', (req, res, next) => {
  res.render('books/details', {
    title: 'Add Book',
    book: {} // Pass an empty book object to the view
  });
});

// POST process the Book Details page to create a new Book - CREATE
router.post('/add', (req, res, next) => {
  const newBook = new books({
    Title: req.body.title,
    Description: req.body.description,
    Price: req.body.price,
    Author: req.body.author,
    Genre: req.body.genre
  });

  newBook.save((err) => {
    if (err) {
      console.log(err);
      return;
    }
    res.redirect('/books');
  });
});

// GET the Book Details page to edit an existing Book
router.get('/:id', (req, res, next) => {
  const id = req.params.id;

  books.findById(id, (err, book) => {
    if (err) {
      console.log(err);
      return;
    }
    res.render('books/details', {
      title: 'Update Book',
      book: book // Pass the retrieved book from the database
    });
  });
});

// POST - process the information passed from the details form and update the document
router.post('/:id', (req, res, next) => {
  const id = req.params.id;

  const updatedBook = {
    Title: req.body.title,
    Description: req.body.description,
    Price: req.body.price,
    Author: req.body.author,
    Genre: req.body.genre
  };

  books.findByIdAndUpdate(id, updatedBook, (err) => {
    if (err) {
      console.log(err);
      return;
    }
    res.redirect('/books');
  });
});

// Handle book deletion
router.get('/delete/:id', (req, res, next) => {
  const id = req.params.id;

  books.findByIdAndRemove(id, (err) => {
    if (err) {
      console.log(err);
      return;
    }
    res.redirect('/books');
  });
});

// Export the router module
module.exports = router;
