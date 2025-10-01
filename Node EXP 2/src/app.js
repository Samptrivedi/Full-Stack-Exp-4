const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// In-memory data store for the playing cards
let cards = [
    { id: 1, suit: 'Hearts', value: 'Ace' },
    { id: 2, suit: 'Spades', value: 'King' },
    { id: 3, suit: 'Diamonds', value: 'Queen' },
];

// To ensure new cards get a unique ID
let nextId = 4;

// --- HTML Endpoint ---

// Serve the index.html file for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


// --- API Endpoints ---

/**
 * @route   GET /cards
 * @desc    Get all playing cards
 */
app.get('/cards', (req, res) => {
    res.status(200).json(cards);
});

/**
 * @route   GET /cards/:id
 * @desc    Get a single card by its ID
 */
app.get('/cards/:id', (req, res) => {
    const cardId = parseInt(req.params.id, 10);
    const card = cards.find(c => c.id === cardId);

    if (card) {
        res.status(200).json(card);
    } else {
        res.status(404).json({ message: `Card with ID ${cardId} not found.` });
    }
});

/**
 * @route   POST /cards
 * @desc    Add a new card to the collection
 */
app.post('/cards', (req, res) => {
    const { suit, value } = req.body;

    if (!suit || !value) {
        return res.status(400).json({ message: 'Both suit and value are required.' });
    }

    const newCard = {
        id: nextId++,
        suit,
        value,
    };

    cards.push(newCard);
    res.status(201).json(newCard); // 201 Created
});

/**
 * @route   DELETE /cards/:id
 * @desc    Delete a card by its ID
 */
app.delete('/cards/:id', (req, res) => {
    const cardId = parseInt(req.params.id, 10);
    const cardIndex = cards.findIndex(c => c.id === cardId);

    if (cardIndex !== -1) {
        const [deletedCard] = cards.splice(cardIndex, 1);
        res.status(200).json({
            message: `Card with ID ${cardId} removed`,
            card: deletedCard,
        });
    } else {
        res.status(404).json({ message: `Card with ID ${cardId} not found.` });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});