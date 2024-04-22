require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Book } = require('./models/books');
const cors = require('cors');

// Initialize Express app
const app = express();

const mongoUrl = process.env.MONGO_URL;

// Middleware
app.use(bodyParser.json());
// Use CORS middleware
app.use(cors({
  origin: 'https://booklibraryqangular.netlify.app'  // Allow requests from this origin
}));


// Connect to MongoDB
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }).then(console.log(mongoUrl));
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define routes
app.get('/books', async (req, res) => {
    try {
        // Retrieve all books from the database
        const books = await Book.find();
        // Send the list of books as a response
        res.json(books);
    } catch (err) {
        // If an error occurs, send an error response
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/books/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const book = await Book.findOne({ isbn });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/books', async (req, res) => {
  const { title, author, description, publicationYear, isbn } = req.body;
  try {
    const book = new Book({ title, author, description, publicationYear, isbn });
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/books/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  const { title, author, description, publicationYear } = req.body;
  try {
    const book = await Book.findOneAndUpdate({ isbn }, { title, author, description, publicationYear }, { new: true });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/books/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const book = await Book.findOneAndDelete({ isbn });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// Start server
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server is running on port ${port}`));

// Export app for testing
module.exports = app;
