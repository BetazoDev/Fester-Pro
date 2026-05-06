const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const Store = require('../models/Store');
const Category = require('../models/Category');

const router = express.Router();

// TEMPORARY: Remove after seeding production DB
router.post('/run', async (req, res) => {
  try {
    await User.deleteMany({});
    await Store.deleteMany({});
    await Category.deleteMany({});

    const admin = await User.create({
      name: 'Administrador Fester',
      email: 'admin@fester.com',
      password: 'admin123',
      role: 'admin',
      city: 'Ciudad de México',
      mobile: '5551234567',
    });

    const supervisor = await User.create({
      name: 'Carlos Méndez',
      email: 'supervisor@fester.com',
      password: 'super123',
      role: 'supervisor',
      city: 'Monterrey',
      mobile: '8181234567',
      createdBy: admin._id,
    });

    const stores = await Store.insertMany([
      { name: 'Home Depot Cumbres', chain: 'Home Depot', address: 'Av. Lincoln 5000, Cumbres', city: 'Monterrey', state: 'Nuevo León', coordinates: { lat: 25.7246, lng: -100.3156 }, geofenceRadius: 200, createdBy: admin._id },
      { name: 'Home Depot Valle', chain: 'Home Depot', address: 'Av. Lázaro Cárdenas 1000, Valle', city: 'Monterrey', state: 'Nuevo León', coordinates: { lat: 25.6515, lng: -100.2895 }, geofenceRadius: 200, createdBy: admin._id },
      { name: 'Home Depot Santa Fe', chain: 'Home Depot', address: 'Av. Vasco de Quiroga 3800', city: 'Ciudad de México', state: 'CDMX', coordinates: { lat: 19.3595, lng: -99.2764 }, geofenceRadius: 250, createdBy: admin._id },
    ]);

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

    await Category.insertMany([
      { name: 'Impermeabilizantes', description: 'Productos de impermeabilización' },
      { name: 'Adhesivos', description: 'Adhesivos y pegamentos' },
      { name: 'Selladores', description: 'Selladores y calafateos' },
      { name: 'Recubrimientos', description: 'Recubrimientos y pinturas especiales' },
    ]);

    res.json({
      success: true,
      message: 'Seed completado',
      credentials: {
        admin: 'admin@fester.com / admin123',
        supervisor: 'supervisor@fester.com / super123',
        promotor: 'promotor@fester.com / promo123',
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
