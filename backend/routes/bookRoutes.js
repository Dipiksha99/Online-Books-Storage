const exp = require("express");

const router = exp.Router();

const Book = require("../models/Book");

router.post("/", async (req, res) => {

    try {

        const book = new Book(req.body);

        console.log(req.body);

        await book.save();

        res.send("Book added successfully");

    } catch (error) {

        console.log(error);

        res.status(500).send("Error adding book");

    }

});


router.put("/:_id", async (req, res) => {

    try {

        const book = await Book.findByIdAndUpdate(
            req.params._id,
            req.body,
            { new: true }
        );

        console.log(book);

        res.json(book);

    } catch (error) {

        console.log(error);

        res.status(400).send(error.message);

    }

});


router.get("/", async (req, res) => {

    try {

        const books = await Book.find();

        console.log(books);

        res.json(books);

    } catch (error) {

        console.log(error);

        res.status(500).send("Error fetching books");

    }

});


router.get("/:_id", async (req, res) => {

    try {

        const book = await Book.findById(req.params._id);

        console.log(book);

        if (!book) {
            return res.status(404).send("Book not found");
        }

        res.json(book);

    } catch (error) {

        console.log(error);

        res.status(400).send("Incorrect book ID");

    }

});


router.delete("/:_id", async (req, res) => {

    try {

        const book = await Book.findByIdAndDelete(req.params._id);

        console.log(book);

        if (!book) {
            return res.status(404).send("Book not found");
        }

        res.json(book);

    } catch (error) {

        console.log(error);

        res.status(400).send("Incorrect book ID");

    }

});


module.exports = router;