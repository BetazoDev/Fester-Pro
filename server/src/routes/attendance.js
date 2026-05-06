const express = require('express');
const { checkIn, checkOut, getByUser, getExceptions, getAll } = require('../controllers/attendanceController');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.post('/check-in', checkIn);
router.post('/check-out', checkOut);
router.get('/', authorize('supervisor', 'admin'), getAll);
router.get('/exceptions', authorize('supervisor', 'admin'), getExceptions);
router.get('/by-user/:userId', getByUser);

module.exports = router;
