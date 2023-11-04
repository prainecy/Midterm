// Import required modules for your Node.js and Express application
let createError = require('http-errors'); // To create HTTP errors
let express = require('express'); // Express web framework
let path = require('path'); // For working with file paths
let cookieParser = require('cookie-parser'); // For parsing cookies
let logger = require('morgan'); // Middleware for request logging

// Import "mongoose" for Database Access
let mongoose = require('mongoose');
// Define the URI for the database
let DB = require('./db');

// Connect to the MongoDB database using Mongoose
mongoose.connect(process.env.URI || DB.URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Get a reference to the MongoDB connection
let mongoDB = mongoose.connection;

// Handle MongoDB connection events
mongoDB.on('error', console.error.bind(console, 'Connection Error:'));
mongoDB.once('open', () => {
  console.log("Connected to MongoDB...");
});

// Define routers for your application
let index = require('../routes/index'); // Top-level routes
let books = require('../routes/books'); // Routes for managing books

// Create an Express application
let app = express();

// Configure your view engine and views directory
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// Middleware setup
app.use(logger('dev')); // Set up request logging
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded requests
app.use(cookieParser()); // Parse cookies
app.use(express.static(path.join(__dirname, '../../client'))); // Serve static files from the 'client' directory

// Route setup
app.use('/', index); // Set the top-level route
app.use('/books', books); // Set routes for books management

// Catch 404 errors and forward them to the error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  // Set locals, providing error messages in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Export the Express app to make it available for other parts of your application
module.exports = app;
