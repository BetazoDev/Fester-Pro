const mongoose = require('mongoose');

const salesReportSchema = new mongoose.Schema({
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
  period: {
    type: String,
    required: true,
  },
  unitsSold: {
    type: Number,
    required: true,
    min: 0,
  },
  revenueGenerated: {
    type: Number,
    default: 0,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sourceFile: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

salesReportSchema.index({ user: 1, store: 1, category: 1, period: 1 });

module.exports = mongoose.model('SalesReport', salesReportSchema);
