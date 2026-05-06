const express = require('express');
const {
  getCategories, createCategory, updateCategory, deleteCategory,
  getProducts, createProduct, updateProduct, deleteProduct,
} = require('../controllers/catalogController');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(auth);

// Categories
router.get('/categories', getCategories);
router.post('/categories', authorize('admin'), createCategory);
router.put('/categories/:id', authorize('admin'), updateCategory);
router.delete('/categories/:id', authorize('admin'), deleteCategory);

// Products
router.get('/products', getProducts);
router.post('/products', authorize('admin'), createProduct);
router.put('/products/:id', authorize('admin'), updateProduct);
router.delete('/products/:id', authorize('admin'), deleteProduct);

module.exports = router;
