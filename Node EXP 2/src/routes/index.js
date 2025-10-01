const express = require('express');
const router = express.Router();

// Sample data
const data = [];

// GET endpoint
router.get('/data', (req, res) => {
    res.json(data);
});

// POST endpoint
router.post('/data', (req, res) => {
    const newItem = req.body;
    data.push(newItem);
    res.json(newItem);
});

// PUT endpoint
router.put('/data/:id', (req, res) => {
    const id = req.params.id;
    const updatedItem = req.body;
    data[id] = updatedItem;
    res.json(updatedItem);
});

module.exports = router;
