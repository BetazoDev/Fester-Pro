const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre de la tienda es obligatorio'],
    trim: true,
  },
  chain: {
    type: String,
    required: [true, 'La cadena es obligatoria'],
    trim: true,
  },
  address: {
    type: String,
    required: [true, 'La dirección es obligatoria'],
  },
  city: {
    type: String,
    required: [true, 'La ciudad es obligatoria'],
  },
  state: {
    type: String,
    default: '',
  },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  geofenceRadius: {
    type: Number,
    default: 200, // meters
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Index for geospatial queries
storeSchema.index({ 'coordinates.lat': 1, 'coordinates.lng': 1 });

module.exports = mongoose.model('Store', storeSchema);
