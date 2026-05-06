const Store = require('../models/Store');

// @desc    Get all stores
// @route   GET /api/stores
const getStores = async (req, res) => {
  try {
    const { chain, city, search } = req.query;
    const query = { isActive: true };

    if (chain) query.chain = { $regex: chain, $options: 'i' };
    if (city) query.city = { $regex: city, $options: 'i' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
      ];
    }

    const stores = await Store.find(query).sort({ chain: 1, name: 1 });
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single store
// @route   GET /api/stores/:id
const getStore = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Tienda no encontrada.' });
    }
    res.json(store);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create store
// @route   POST /api/stores
const createStore = async (req, res) => {
  try {
    const store = await Store.create({
      ...req.body,
      createdBy: req.user._id,
    });
    res.status(201).json(store);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update store
// @route   PUT /api/stores/:id
const updateStore = async (req, res) => {
  try {
    const store = await Store.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!store) {
      return res.status(404).json({ message: 'Tienda no encontrada.' });
    }
    res.json(store);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete store (soft)
// @route   DELETE /api/stores/:id
const deleteStore = async (req, res) => {
  try {
    const store = await Store.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!store) {
      return res.status(404).json({ message: 'Tienda no encontrada.' });
    }
    res.json({ message: 'Tienda desactivada correctamente.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStores, getStore, createStore, updateStore, deleteStore };
