const express = require('express');
const router = express.Router();
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

// Create a new booking
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      garage_id,
      phone_number,
      booking_date,
      booking_time,
      damage_description,
      damage_image
    } = req.body;

    const [result] = await db.execute(
      `INSERT INTO bookings (
        customer_id, garage_id, phone_number, booking_date, 
        booking_time, damage_description, damage_image
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.userId,
        garage_id,
        phone_number,
        booking_date,
        booking_time,
        damage_description,
        damage_image
      ]
    );

    res.status(201).json({
      message: 'Booking created successfully',
      bookingId: result.insertId
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ message: 'Error creating booking' });
  }
});

// Get customer's bookings
router.get('/customer', authMiddleware, async (req, res) => {
  try {
    const [bookings] = await db.execute(`
      SELECT b.*, g.garage_name, g.address, g.phone as garage_phone
      FROM bookings b
      JOIN garages g ON b.garage_id = g.id
      WHERE b.customer_id = ?
      ORDER BY b.created_at DESC
    `, [req.user.userId]);

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching customer bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// Get garage's bookings
router.get('/garage', authMiddleware, async (req, res) => {
  try {
    const [bookings] = await db.execute(`
      SELECT b.*, u.username as customer_name
      FROM bookings b
      JOIN users u ON b.customer_id = u.id
      JOIN garages g ON b.garage_id = g.id
      WHERE g.user_id = ?
      ORDER BY b.created_at DESC
    `, [req.user.userId]);

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching garage bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// Update booking status (for garage owners)
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const bookingId = req.params.id;

    // Verify that the garage owner owns the garage associated with this booking
    const [bookings] = await db.execute(`
      SELECT b.* FROM bookings b
      JOIN garages g ON b.garage_id = g.id
      WHERE b.id = ? AND g.user_id = ?
    `, [bookingId, req.user.userId]);

    if (bookings.length === 0) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await db.execute(
      'UPDATE bookings SET status = ? WHERE id = ?',
      [status, bookingId]
    );

    res.json({ message: 'Booking status updated successfully' });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Error updating booking status' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
      const [booking] = await db.execute(
        'SELECT * FROM bookings WHERE id = ? AND customer_id = ?',
        [req.params.id, req.user.userId]
      );
  
      if (booking.length === 0) {
        return res.status(404).json({ message: 'Booking not found' });
      }
  
      await db.execute(
        'DELETE FROM bookings WHERE id = ? AND customer_id = ?',
        [req.params.id, req.user.userId]
      );
  
      res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
      console.error('Error deleting booking:', error);
      res.status(500).json({ message: 'Error cancelling booking' });
    }
  });

module.exports = router;
