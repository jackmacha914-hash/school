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
    console.log('POST /api/books called with body:', req.body);
    const { title, author, year, genre, status } = req.body;
    
    // Input validation
    if (!title || !author) {
        console.error('Missing required fields:', { title, author });
        return res.status(400).json({ 
            message: 'Title and author are required',
            receivedData: req.body 
        });
    }

    console.log('Creating book with data:', { title, author, year, genre, status });
    
    try {
        const book = new Book({ title, author, year, genre, status });
        console.log('Book instance created, attempting to save...');
        
        const savedBook = await book.save();
        console.log('Book saved successfully:', savedBook);
        
        return res.status(201).json(savedBook);
    } catch (err) {
        console.error('Error saving book:', {
            error: err.message,
            name: err.name,
            code: err.code,
            keyPattern: err.keyPattern,
            keyValue: err.keyValue,
            stack: err.stack
        });
        
        // More specific error handling
        if (err.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Validation Error',
                errors: err.errors 
            });
        }
        
        return res.status(500).json({ 
            message: 'Failed to save book',
            error: err.message 
        });
    }
});

module.exports = router;
