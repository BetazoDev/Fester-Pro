const mongoose = require('mongoose');

const evidenceSchema = new mongoose.Schema({
  attendance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Attendance',
    required: true,
  },
  evidenceType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EvidenceType',
    required: true,
  },
  photoUrl: {
    type: String,
    required: [true, 'La URL de la foto es obligatoria'],
  },
  thumbnailUrl: {
    type: String,
    default: '',
  },
  watermark: {
    date: { type: String },
    time: { type: String },
    gps: { type: String },
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  reviewedAt: {
    type: Date,
  },
  notes: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Evidence', evidenceSchema);
