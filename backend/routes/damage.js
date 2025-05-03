const express = require('express');
const router = express.Router();
const multer = require('multer');
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');
const predictionService = require('../services/predictionService');

// Configure multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Upload image and get predictions
router.post('/predict', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Get predictions from FastAPI service
    const predictions = await predictionService.predictDamage(req.file.buffer);

    // Get recommended garages
    const predictionStr = predictions.map(p => `'${p}'`).join(',');
    const [garages] = await db.execute(`
      SELECT DISTINCT g.*, 
        GROUP_CONCAT(DISTINCT grt.repair_type) as repair_types,
        COUNT(DISTINCT grt.repair_type) as matching_repairs
      FROM garages g
      JOIN garage_repair_types grt ON g.id = grt.garage_id
      WHERE g.is_active = 1
      AND grt.repair_type IN (${predictionStr})
      GROUP BY g.id
      HAVING matching_repairs = ?
      ORDER BY g.id
    `, [predictions.length]);

    // Format repair types
    garages.forEach(garage => {
      garage.repair_types = garage.repair_types ? garage.repair_types.split(',') : [];
    });

    // Save image as base64
    const imageBase64 = req.file.buffer.toString('base64');

    // Save damage history
    const [historyResult] = await db.execute(
      'INSERT INTO damage_history (user_id, image_url) VALUES (?, ?)',
      [req.user.userId, imageBase64]
    );

    const historyId = historyResult.insertId;

    // Save damage types
    for (const damageType of predictions) {
      await db.execute(
        'INSERT INTO damage_types_history (history_id, damage_type) VALUES (?, ?)',
        [historyId, damageType]
      );
    }

    res.json({
      historyId,
      predictions,
      recommendedGarages: garages
    });
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ message: 'Error processing image' });
  }
});

// Get damage history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const [history] = await db.execute(`
      SELECT dh.*, 
        GROUP_CONCAT(dth.damage_type) as damage_types
      FROM damage_history dh
      LEFT JOIN damage_types_history dth ON dh.id = dth.history_id
      WHERE dh.user_id = ?
      GROUP BY dh.id
      ORDER BY dh.date_recorded DESC
    `, [req.user.userId]);

    // Format damage types as arrays
    history.forEach(record => {
      record.damage_types = record.damage_types
      record.damage_types = record.damage_types ? record.damage_types.split(',') : [];
    });

    res.json(history);
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({ message: 'Error fetching damage history' });
  }
});

// Get specific damage record
router.get('/history/:id', authMiddleware, async (req, res) => {
  try {
    const [records] = await db.execute(`
      SELECT dh.*, 
        GROUP_CONCAT(dth.damage_type) as damage_types
      FROM damage_history dh
      LEFT JOIN damage_types_history dth ON dh.id = dth.history_id
      WHERE dh.id = ? AND dh.user_id = ?
      GROUP BY dh.id
    `, [req.params.id, req.user.userId]);

    if (records.length === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }

    const record = records[0];
    record.damage_types = record.damage_types ? record.damage_types.split(',') : [];

    res.json(record);
  } catch (error) {
    console.error('Record fetch error:', error);
    res.status(500).json({ message: 'Error fetching damage record' });
  }
});

router.delete('/history/:id', authMiddleware, async (req, res) => {
  try {
    await db.execute(
      'DELETE FROM damage_history WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.userId]
    );
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Error deleting record' });
  }
});

module.exports = router;