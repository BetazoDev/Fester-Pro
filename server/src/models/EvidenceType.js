const mongoose = require('mongoose');

const evidenceTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del tipo de evidencia es obligatorio'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  isRequired: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Scope: can be global or per-store
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('EvidenceType', evidenceTypeSchema);
