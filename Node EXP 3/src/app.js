// Import necessary modules
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// --- In-Memory Data Store ---
const TOTAL_SEATS = 50; // Total number of seats available
const LOCK_TIMEOUT = 60 * 1000; // Lock timeout in milliseconds (1 minute)

let seats = {};

// Initialize the seats with an 'available' status
const initializeSeats = () => {
  seats = {}; // Reset seats
  for (let i = 1; i <= TOTAL_SEATS; i++) {
    seats[i] = {
      status: 'available', // possible statuses: 'available', 'locked', 'booked'
    };
  }
};

initializeSeats(); // Call on startup

// --- Middleware ---
app.use(express.json()); // To parse JSON bodies in POST requests
app.use(express.static(path.join(__dirname))); // Serve static files like index.html

// --- API Endpoints ---

/**
 * @route   GET /
 * @desc    Serve the main HTML page
 * @access  Public
 */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


/**
 * @route   GET /seats
 * @desc    Get the status of all seats
 * @access  Public
 */
app.get('/seats', (req, res) => {
  const publicSeats = {};
  for (const seatId in seats) {
    publicSeats[seatId] = {
      status: seats[seatId].status,
    };
  }
  res.json(publicSeats);
});

/**
 * @route   POST /lock/:seatId
 * @desc    Lock a specific seat for a user temporarily
 * @access  Public
 */
app.post('/lock/:seatId', (req, res) => {
  const { seatId } = req.params;
  const seat = seats[seatId];
  const now = Date.now();

  if (!seat) {
    return res.status(404).json({ message: 'Seat not found' });
  }

  if (seat.status === 'booked') {
    return res.status(400).json({ message: 'Seat is already booked' });
  }

  if (seat.status === 'locked' && seat.lockExpiresAt > now) {
    return res.status(400).json({ message: 'Seat is currently locked by another user' });
  }

  seat.status = 'locked';
  seat.lockExpiresAt = now + LOCK_TIMEOUT;

  res.json({ message: `Seat ${seatId} locked successfully. Confirm within 1 minute.` });
});

/**
 * @route   POST /confirm/:seatId
 * @desc    Confirm the booking for a locked seat
 * @access  Public
 */
app.post('/confirm/:seatId', (req, res) => {
  const { seatId } = req.params;
  const seat = seats[seatId];
  const now = Date.now();

  if (!seat) {
    return res.status(404).json({ message: 'Seat not found' });
  }

  if (seat.status !== 'locked') {
    return res.status(400).json({ message: 'Seat is not locked and cannot be booked' });
  }

  if (seat.lockExpiresAt <= now) {
    seat.status = 'available';
    delete seat.lockExpiresAt;
    return res.status(400).json({ message: 'Your lock has expired. Please lock the seat again.' });
  }

  seat.status = 'booked';
  delete seat.lockExpiresAt;

  res.json({ message: `Seat ${seatId} booked successfully!` });
});

/**
 * @route   POST /reset
 * @desc    Reset all seats to 'available' (for testing purposes)
 * @access  Public
 */
app.post('/reset', (req, res) => {
    initializeSeats();
    res.json({ message: 'All seats have been reset to available.' });
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Ticket booking server running on http://localhost:${PORT}`);
});