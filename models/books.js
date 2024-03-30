const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  description: String,
  publicationYear: Number,
  isbn: { type: String, unique: true }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = { Book };