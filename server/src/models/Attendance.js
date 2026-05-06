const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: () => new Date().setHours(0, 0, 0, 0),
  },
  checkIn: {
    time: { type: Date },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  checkOut: {
    time: { type: Date },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  status: {
    type: String,
    enum: ['on-time', 'late', 'absent', 'pending'],
    default: 'pending',
  },
  isValidGPS: {
    type: Boolean,
    default: true,
  },
  gpsDistance: {
    type: Number, // distance in meters from store
    default: 0,
  },
  toleranceExceeded: {
    type: Boolean,
    default: false,
  },
  notes: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

// Compound index: one attendance per user per store per day
attendanceSchema.index({ user: 1, store: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
