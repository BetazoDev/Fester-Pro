const express = require('express');
const { getUsers, getUser, updateUser, deleteUser, assignStores, getPromotors } = require('../controllers/userController');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/promotors', authorize('supervisor', 'admin'), getPromotors);
router.get('/', authorize('supervisor', 'admin'), getUsers);
router.get('/:id', authorize('supervisor', 'admin'), getUser);
router.put('/:id', authorize('supervisor', 'admin'), updateUser);
router.delete('/:id', authorize('admin'), deleteUser);
router.patch('/:id/stores', authorize('supervisor', 'admin'), assignStores);

module.exports = router;
