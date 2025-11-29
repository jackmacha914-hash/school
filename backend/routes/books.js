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
    console.log('Received request to add book:', req.body);
    
    const { title, author, year, genre, status, className } = req.body;
    
    // Log the received data
    console.log('Book data:', { title, author, year, genre, status, className });
    
    // Validate required fields
    if (!title || !author) {
        console.error('Missing required fields');
        return res.status(400).json({ 
            success: false,
            message: 'Title and author are required' 
        });
    }

    try {
        const book = new Book({ 
            title, 
            author, 
            year: year || new Date().getFullYear(),
            genre: genre || 'General',
            status: status || 'available',
            className: className || null
        });

        console.log('Attempting to save book:', book);
        
        const savedBook = await book.save();
        console.log('Book saved successfully:', savedBook);
        
        return res.status(201).json({
            success: true,
            data: savedBook
        });
        
    } catch (error) {
        console.error('Error saving book:', {
            error: error.message,
            name: error.name,
            code: error.code,
            keyPattern: error.keyPattern,
            stack: error.stack
        });
        
        res.status(500).json({ 
            success: false,
            message: 'Failed to save book',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

module.exports = router;
