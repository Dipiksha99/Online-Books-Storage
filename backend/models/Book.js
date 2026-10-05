const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    price: Number,
    category: String,
    description: String,
    image: String,
    stock: Number,
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;