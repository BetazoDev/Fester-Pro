const User = require('../models/User');

// @desc    Get all users (filtered by role if needed)
// @route   GET /api/users
const getUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .populate('assignedStores', 'name chain city')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.json({
      users,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('assignedStores');

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
const updateUser = async (req, res) => {
  try {
    const { name, email, phone, mobile, city, role, isActive, assignedStores } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (mobile !== undefined) user.mobile = mobile;
    if (city) user.city = city;
    if (role && req.user.role === 'admin') user.role = role;
    if (isActive !== undefined) user.isActive = isActive;
    if (assignedStores) user.assignedStores = assignedStores;

    await user.save();

    const updatedUser = await User.findById(user._id).populate('assignedStores');
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user (soft delete)
// @route   DELETE /api/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    user.isActive = false;
    await user.save();

    res.json({ message: 'Usuario desactivado correctamente.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign stores to a promoter
// @route   PATCH /api/users/:id/stores
const assignStores = async (req, res) => {
  try {
    const { storeIds } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    user.assignedStores = storeIds;
    await user.save();

    const updatedUser = await User.findById(user._id).populate('assignedStores');
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get promoters only
// @route   GET /api/users/promotors
const getPromotors = async (req, res) => {
  try {
    const promotors = await User.find({ role: 'promotor', isActive: true })
      .populate('assignedStores', 'name chain city')
      .sort({ name: 1 });

    res.json(promotors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsers, getUser, updateUser, deleteUser, assignStores, getPromotors };
