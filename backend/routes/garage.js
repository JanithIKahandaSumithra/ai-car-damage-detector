const express = require('express');
const router = express.Router();
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

// Get all garages
router.get('/', async (req, res) => {
  try {
    const [garages] = await db.execute(`
      SELECT g.*, GROUP_CONCAT(grt.repair_type) as repair_types
      FROM garages g
      LEFT JOIN garage_repair_types grt ON g.id = grt.garage_id
      GROUP BY g.id
      ORDER BY g.id DESC
    `);

    garages.forEach(garage => {
      garage.repair_types = garage.repair_types ? garage.repair_types.split(',') : [];
    });

    res.json(garages);
  } catch (error) {
    console.error('Get garages error:', error);
    res.status(500).json({ message: 'Error fetching garages' });
  }
});

// Get garages by user ID
router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    const [garages] = await db.execute(`
      SELECT g.*, 
        GROUP_CONCAT(DISTINCT grt.repair_type) as repair_types
      FROM garages g
      LEFT JOIN garage_repair_types grt ON g.id = grt.garage_id
      WHERE g.user_id = ?
      GROUP BY g.id
      ORDER BY g.id DESC
    `, [req.params.userId]);

    garages.forEach(garage => {
      garage.repair_types = garage.repair_types ? garage.repair_types.split(',') : [];
    });

    res.json(garages);
  } catch (error) {
    console.error('Error fetching user garages:', error);
    res.status(500).json({ message: 'Error fetching garages' });
  }
});

// Register garage
router.post('/register', authMiddleware, async (req, res) => {
  try {
    const {
      garageName,
      phone,
      email,
      address,
      city,
      businessHours,
      isActive,
      repairTypes
    } = req.body;

    // Validate user type
    if (req.user.userType !== 'garage_owner') {
      return res.status(403).json({ message: 'Only garage owners can register garages' });
    }

    // Check if garage exists
    const [existingGarages] = await db.execute(
      'SELECT id FROM garages WHERE email = ? OR phone = ?',
      [email, phone]
    );

    if (existingGarages.length > 0) {
      return res.status(400).json({ message: 'Garage already registered with this email or phone' });
    }

    // Insert garage
    const [result] = await db.execute(
      'INSERT INTO garages (user_id, garage_name, phone, email, address, city, business_hours, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [req.user.userId, garageName, phone, email, address, city, businessHours, isActive]
    );

    const garageId = result.insertId;

    // Insert repair types
    for (const repairType of repairTypes) {
      await db.execute(
        'INSERT INTO garage_repair_types (garage_id, repair_type) VALUES (?, ?)',
        [garageId, repairType]
      );
    }

    res.status(201).json({
      message: 'Garage registered successfully',
      garageId
    });
  } catch (error) {
    console.error('Garage registration error:', error);
    res.status(500).json({ message: 'Error registering garage' });
  }
});

// Get garage details
router.get('/:id', async (req, res) => {
  try {
    const [garages] = await db.execute(`
      SELECT g.*, GROUP_CONCAT(grt.repair_type) as repair_types
      FROM garages g
      LEFT JOIN garage_repair_types grt ON g.id = grt.garage_id
      WHERE g.id = ?
      GROUP BY g.id
    `, [req.params.id]);

    if (garages.length === 0) {
      return res.status(404).json({ message: 'Garage not found' });
    }

    const garage = garages[0];
    garage.repair_types = garage.repair_types ? garage.repair_types.split(',') : [];

    res.json(garage);
  } catch (error) {
    console.error('Get garage error:', error);
    res.status(500).json({ message: 'Error fetching garage details' });
  }
});

// Update garage
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const {
      garageName,
      phone,
      email,
      address,
      city,
      businessHours,
      isActive,
      repairTypes
    } = req.body;

    // Check if garage belongs to user
    const [garages] = await db.execute(
      'SELECT user_id FROM garages WHERE id = ?',
      [req.params.id]
    );

    if (garages.length === 0) {
      return res.status(404).json({ message: 'Garage not found' });
    }

    if (garages[0].user_id !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized to update this garage' });
    }

    // Update garage details
    await db.execute(
      `UPDATE garages 
       SET garage_name = ?, phone = ?, email = ?, address = ?, 
           city = ?, business_hours = ?, is_active = ?
       WHERE id = ?`,
      [garageName, phone, email, address, city, businessHours, isActive, req.params.id]
    );

    // Delete existing repair types
    await db.execute('DELETE FROM garage_repair_types WHERE garage_id = ?', [req.params.id]);

    // Insert new repair types
    for (const repairType of repairTypes) {
      await db.execute(
        'INSERT INTO garage_repair_types (garage_id, repair_type) VALUES (?, ?)',
        [req.params.id, repairType]
      );
    }

    res.json({ message: 'Garage updated successfully' });
  } catch (error) {
    console.error('Update garage error:', error);
    res.status(500).json({ message: 'Error updating garage' });
  }
});

// Get recommended garages
router.post('/recommend', authMiddleware, async (req, res) => {
  try {
    const { damageTypes } = req.body;

    if (!Array.isArray(damageTypes) || damageTypes.length === 0) {
      return res.status(400).json({ message: 'Invalid damage types' });
    }

    const damageTypesStr = damageTypes.map(type => `'${type}'`).join(',');
    
    const [garages] = await db.execute(`
      SELECT DISTINCT g.*, 
        GROUP_CONCAT(DISTINCT grt.repair_type) as repair_types,
        COUNT(DISTINCT grt.repair_type) as matching_repairs
      FROM garages g
      JOIN garage_repair_types grt ON g.id = grt.garage_id
      WHERE g.is_active = 1
      AND grt.repair_type IN (${damageTypesStr})
      GROUP BY g.id
      HAVING matching_repairs = ?
      ORDER BY g.id
    `, [damageTypes.length]);

    garages.forEach(garage => {
      garage.repair_types = garage.repair_types ? garage.repair_types.split(',') : [];
    });

    res.json(garages);
  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({ message: 'Error getting recommendations' });
  }
});

module.exports = router;