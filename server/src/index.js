require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/stores', require('./routes/stores'));
app.use('/api/catalog', require('./routes/catalog'));
app.use('/api/attendance', require('./routes/attendance'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Temporary Seed Endpoint
app.get('/api/seed', async (req, res) => {
  try {
    const User = require('./models/User');
    const Store = require('./models/Store');
    const Category = require('./models/Category');

    // Clear existing data
    await User.deleteMany({});
    await Store.deleteMany({});
    await Category.deleteMany({});

    // Create admin
    const admin = await User.create({
      name: 'Administrador Fester',
      email: 'admin@fester.com',
      password: 'admin123',
      role: 'admin',
      city: 'Ciudad de México',
      mobile: '5551234567',
    });

    // Create supervisor
    const supervisor = await User.create({
      name: 'Carlos Méndez',
      email: 'supervisor@fester.com',
      password: 'super123',
      role: 'supervisor',
      city: 'Monterrey',
      mobile: '8181234567',
      createdBy: admin._id,
    });

    // Create stores
    const stores = await Store.insertMany([
      {
        name: 'Home Depot Cumbres',
        chain: 'Home Depot',
        address: 'Av. Lincoln 5000, Cumbres',
        city: 'Monterrey',
        state: 'Nuevo León',
        coordinates: { lat: 25.7246, lng: -100.3156 },
        geofenceRadius: 200,
        createdBy: admin._id,
      },
      {
        name: 'Home Depot Valle',
        chain: 'Home Depot',
        address: 'Av. Lázaro Cárdenas 1000, Valle',
        city: 'Monterrey',
        state: 'Nuevo León',
        coordinates: { lat: 25.6515, lng: -100.2895 },
        geofenceRadius: 200,
        createdBy: admin._id,
      },
      {
        name: 'Home Depot Santa Fe',
        chain: 'Home Depot',
        address: 'Av. Vasco de Quiroga 3800',
        city: 'Ciudad de México',
        state: 'CDMX',
        coordinates: { lat: 19.3595, lng: -99.2764 },
        geofenceRadius: 250,
        createdBy: admin._id,
      },
    ]);

    // Create promoter with assigned stores
    await User.create({
      name: 'María López',
      email: 'promotor@fester.com',
      password: 'promo123',
      role: 'promotor',
      city: 'Monterrey',
      mobile: '8189876543',
      assignedStores: [stores[0]._id, stores[1]._id],
      createdBy: supervisor._id,
    });

    // Create categories
    await Category.insertMany([
      { name: 'Impermeabilizantes', description: 'Productos de impermeabilización' },
      { name: 'Adhesivos', description: 'Adhesivos y pegamentos' },
      { name: 'Selladores', description: 'Selladores y calafateos' },
      { name: 'Recubrimientos', description: 'Recubrimientos y pinturas especiales' },
    ]);

    res.json({ message: '✅ Seed completed successfully' });
  } catch (error) {
    console.error('❌ Seed error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Fester API running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
