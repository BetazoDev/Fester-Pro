const Attendance = require('../models/Attendance');
const Store = require('../models/Store');
const { calculateDistance } = require('../services/gpsService');

// @desc    Check-in
// @route   POST /api/attendance/check-in
const checkIn = async (req, res) => {
  try {
    const { storeId, coordinates } = req.body;
    const userId = req.user._id;

    // Get store for GPS validation
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Tienda no encontrada.' });
    }

    // Calculate distance from store
    const distance = calculateDistance(
      coordinates.lat, coordinates.lng,
      store.coordinates.lat, store.coordinates.lng
    );

    const isValidGPS = distance <= store.geofenceRadius;

    // Check if already checked in today for this store
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await Attendance.findOne({
      user: userId,
      store: storeId,
      date: today,
    });

    if (existing && existing.checkIn.time) {
      return res.status(400).json({ message: 'Ya registraste entrada hoy para esta tienda.' });
    }

    const attendance = existing || new Attendance({
      user: userId,
      store: storeId,
      date: today,
    });

    attendance.checkIn = {
      time: new Date(),
      coordinates,
    };
    attendance.isValidGPS = isValidGPS;
    attendance.gpsDistance = Math.round(distance);
    attendance.status = 'on-time'; // TODO: compare against schedule

    await attendance.save();

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check-out
// @route   POST /api/attendance/check-out
const checkOut = async (req, res) => {
  try {
    const { storeId, coordinates } = req.body;
    const userId = req.user._id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      user: userId,
      store: storeId,
      date: today,
    });

    if (!attendance) {
      return res.status(404).json({ message: 'No se encontró registro de entrada para hoy.' });
    }

    if (attendance.checkOut?.time) {
      return res.status(400).json({ message: 'Ya registraste salida hoy para esta tienda.' });
    }

    attendance.checkOut = {
      time: new Date(),
      coordinates,
    };

    await attendance.save();

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get attendance by user (with date range)
// @route   GET /api/attendance/by-user/:userId
const getByUser = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { user: req.params.userId };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const records = await Attendance.find(query)
      .populate('store', 'name chain city')
      .sort({ date: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get exceptions (late, GPS violations)
// @route   GET /api/attendance/exceptions
const getExceptions = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {
      $or: [
        { status: 'late' },
        { isValidGPS: false },
        { toleranceExceeded: true },
      ],
    };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const exceptions = await Attendance.find(query)
      .populate('user', 'name email')
      .populate('store', 'name chain city')
      .sort({ date: -1 });

    res.json(exceptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all attendance (for dashboard)
// @route   GET /api/attendance
const getAll = async (req, res) => {
  try {
    const { date, page = 1, limit = 50 } = req.query;
    const query = {};

    if (date) {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      query.date = d;
    }

    const total = await Attendance.countDocuments(query);
    const records = await Attendance.find(query)
      .populate('user', 'name email role')
      .populate('store', 'name chain city')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ date: -1 });

    res.json({ records, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { checkIn, checkOut, getByUser, getExceptions, getAll };
