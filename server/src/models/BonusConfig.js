const mongoose = require('mongoose');

const bonusConfigSchema = new mongoose.Schema({
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
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  // Monthly sales goal in units
  monthlyGoal: {
    type: Number,
    required: true,
    min: 0,
  },
  // Base bonus amount (MXN) for reaching 100%
  bonusBase: {
    type: Number,
    required: true,
    min: 0,
  },
  // Extra pay per unit sold above 100% goal
  acceleratorRate: {
    type: Number,
    default: 15, // $15 MXN per extra unit
  },
  // Period format: YYYY-MM
  period: {
    type: String,
    required: true,
  },
  // Operational bonus for evidence compliance
  operationalBonusBase: {
    type: Number,
    default: 0,
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

bonusConfigSchema.index({ user: 1, store: 1, category: 1, period: 1 }, { unique: true });

module.exports = mongoose.model('BonusConfig', bonusConfigSchema);
