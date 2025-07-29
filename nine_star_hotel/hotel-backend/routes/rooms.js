const express = require("express");
const { db } = require("../config/database");

const router = express.Router();

// GET /rooms - Get all rooms (simplified query)
router.get("/", (req, res) => {
  const query = `
    SELECT
      room_id,
      room_number,
      room_type,
      price_per_night,
      status,
      floor_number,
      max_occupancy,
      amenities,
      description,
      created_at,
      updated_at
    FROM rooms
    WHERE is_deleted = FALSE
    ORDER BY room_number
  `;

  db.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching rooms:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch rooms',
        details: error.message
      });
    }

    // Transform data to match frontend expectations
    const rooms = results.map(row => ({
      id: row.room_id,
      number: row.room_number,
      type: row.room_type,
      price: parseFloat(row.price_per_night),
      status: row.status === 'AVAILABLE' ? 'Available' :
              row.status === 'BOOKED' ? 'Booked' :
              row.status === 'CLEANING_PENDING' ? 'Cleaning Pending' :
              row.status === 'MAINTENANCE' ? 'Maintenance' :
              row.status === 'OUT_OF_ORDER' ? 'Out of Order' : row.status,
      floor: row.floor_number,
      maxOccupancy: row.max_occupancy,
      amenities: row.amenities ? JSON.parse(row.amenities) : [],
      description: row.description,
      guest: null, // Will be populated by separate query if needed
      checkinDate: null,
      checkoutDate: null,
      guestCount: null
    }));

    res.json({ success: true, data: rooms });
  });
});

// POST /rooms - Create new room
router.post("/", (req, res) => {
  const { number, type, price, floor, maxOccupancy, amenities, description } = req.body;

  // Validation
  if (!number || !type || !price) {
    return res.status(400).json({ error: 'Room number, type, and price are required' });
  }

  const query = `
    INSERT INTO rooms (room_number, room_type, price_per_night, floor_number, max_occupancy, amenities, description)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    number.trim(),
    type,
    parseFloat(price),
    floor || null,
    maxOccupancy || 4,
    amenities ? JSON.stringify(amenities) : null,
    description || null
  ];

  db.query(query, values, (error, results) => {
    if (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Room number already exists' });
      }
      console.error('Error creating room:', error);
      return res.status(500).json({ error: 'Failed to create room' });
    }

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: { roomId: results.insertId, number, type, price }
    });
  });
});

// PUT /rooms/:id - Update room
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { number, type, price, floor, maxOccupancy, amenities, description } = req.body;

  const query = `
    UPDATE rooms
    SET room_number = ?, room_type = ?, price_per_night = ?, floor_number = ?,
        max_occupancy = ?, amenities = ?, description = ?, updated_at = CURRENT_TIMESTAMP
    WHERE room_id = ? AND is_deleted = FALSE
  `;

  const values = [
    number?.trim(),
    type,
    price ? parseFloat(price) : undefined,
    floor,
    maxOccupancy,
    amenities ? JSON.stringify(amenities) : null,
    description,
    parseInt(id)
  ].filter(val => val !== undefined);

  db.query(query, values, (error, results) => {
    if (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Room number already exists' });
      }
      console.error('Error updating room:', error);
      return res.status(500).json({ error: 'Failed to update room' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.json({ success: true, message: 'Room updated successfully' });
  });
});

// DELETE /rooms/:id - Soft delete room
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  // Check if room has active bookings
  const checkQuery = `
    SELECT COUNT(*) as active_bookings
    FROM bookings
    WHERE room_id = ? AND booking_status IN ('CONFIRMED', 'CHECKED_IN')
  `;

  db.query(checkQuery, [parseInt(id)], (error, results) => {
    if (error) {
      console.error('Error checking room bookings:', error);
      return res.status(500).json({ error: 'Failed to check room status' });
    }

    if (results[0].active_bookings > 0) {
      return res.status(400).json({ error: 'Cannot delete room with active bookings' });
    }

    // Soft delete the room
    const deleteQuery = `
      UPDATE rooms
      SET is_deleted = TRUE, updated_at = CURRENT_TIMESTAMP
      WHERE room_id = ?
    `;

    db.query(deleteQuery, [parseInt(id)], (deleteError, deleteResults) => {
      if (deleteError) {
        console.error('Error deleting room:', deleteError);
        return res.status(500).json({ error: 'Failed to delete room' });
      }

      if (deleteResults.affectedRows === 0) {
        return res.status(404).json({ error: 'Room not found' });
      }

      res.json({ success: true, message: 'Room deleted successfully' });
    });
  });
});

// PUT /rooms/:id/status - Update room status
router.put("/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validate status
  const validStatuses = ['AVAILABLE', 'BOOKED', 'CLEANING_PENDING', 'MAINTENANCE', 'OUT_OF_ORDER'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid room status' });
  }

  const query = `
    UPDATE rooms
    SET status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE room_id = ? AND is_deleted = FALSE
  `;

  db.query(query, [status, parseInt(id)], (error, results) => {
    if (error) {
      console.error('Error updating room status:', error);
      return res.status(500).json({ error: 'Failed to update room status' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.json({ success: true, message: 'Room status updated successfully' });
  });
});

// GET /rooms/available - Get available rooms for booking
router.get("/available", (req, res) => {
  const { checkin, checkout, roomType } = req.query;

  let query = `
    SELECT room_id, room_number, room_type, price_per_night, floor_number, max_occupancy, amenities, description
    FROM rooms
    WHERE status = 'AVAILABLE' AND is_deleted = FALSE
  `;

  const queryParams = [];

  if (roomType) {
    query += ` AND room_type = ?`;
    queryParams.push(roomType);
  }

  // If dates provided, check for conflicts
  if (checkin && checkout) {
    query += ` AND room_id NOT IN (
      SELECT room_id FROM bookings
      WHERE booking_status IN ('CONFIRMED', 'CHECKED_IN')
      AND (
        (checkin_date <= ? AND checkout_date > ?) OR
        (checkin_date < ? AND checkout_date >= ?) OR
        (checkin_date >= ? AND checkout_date <= ?)
      )
    )`;
    queryParams.push(checkout, checkin, checkout, checkin, checkin, checkout);
  }

  query += ` ORDER BY room_type, room_number`;

  db.query(query, queryParams, (error, results) => {
    if (error) {
      console.error('Error fetching available rooms:', error);
      return res.status(500).json({ error: 'Failed to fetch available rooms' });
    }

    const rooms = results.map(row => ({
      id: row.room_id,
      number: row.room_number,
      type: row.room_type,
      price: parseFloat(row.price_per_night),
      floor: row.floor_number,
      maxOccupancy: row.max_occupancy,
      amenities: row.amenities ? JSON.parse(row.amenities) : []
    }));

    res.json({ success: true, data: rooms });
  });
});

module.exports = router;
