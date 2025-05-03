const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const garageRoutes = require('./routes/garage');
const damageRoutes = require('./routes/damage');
const userRoutes = require('./routes/users'); 
const bookingRoutes = require('./routes/booking');
const chatRoutes = require('./routes/chat');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/garage', garageRoutes);
app.use('/api/damage', damageRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/booking', bookingRoutes);
app.use('/api/chat', chatRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
