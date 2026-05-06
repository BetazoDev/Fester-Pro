const express = require('express');
const { getStores, getStore, createStore, updateStore, deleteStore } = require('../controllers/storeController');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', getStores);
router.get('/:id', getStore);
router.post('/', authorize('supervisor', 'admin'), createStore);
router.put('/:id', authorize('supervisor', 'admin'), updateStore);
router.delete('/:id', authorize('admin'), deleteStore);

module.exports = router;
