// routes/books.js
const express = require('express');
const Book = require('../models/Book');
const router = express.Router();

// Get all books with advanced filtering support
router.get('/', async (req, res) => {
    try {
        const { search, genre, author, year, status } = req.query;
        let filter = {};

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        if (genre) filter.genre = genre;
        if (author) filter.author = { $regex: author, $options: 'i' };
        if (year) filter.year = year;
        if (status) filter.status = status;

        const books = await Book.find(filter);
        res.status(200).json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new book
router.post('/', async (req, res) => {
    const { title, author, year, genre, status } = req.body;
    console.log('Attempting to save book with data:', { title, author, year, genre, status });
    console.log('Environment:', process.env.NODE_ENV);
    console.log('MongoDB URI exists:', !!process.env.MONGODB_URI);

    try {
        const book = new Book({ title, author, year, genre, status });
        console.log('Book instance created, attempting to save...');
        const savedBook = await book.save();
        console.log('Book saved successfully:', savedBook);
        res.status(201).json(savedBook);
    } catch (error) {
        console.error('Error saving book:', error);
        res.status(500).json({ 
            message: 'Failed to save book',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

module.exports = router;
