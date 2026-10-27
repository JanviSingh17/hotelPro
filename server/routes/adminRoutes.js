const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllStaff,
  addStaff,
  updateStaff,
  deleteStaff,
  getAllGuests,
  getAllPayments,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// All admin routes are protected and adminOnly
router.use(protect, adminOnly);

router.get('/stats', getDashboardStats);

// Staff management
router.get('/staff', getAllStaff);
router.post('/staff', addStaff);
router.put('/staff/:id', updateStaff);
router.delete('/staff/:id', deleteStaff);

// Guest & Payment reports
router.get('/guests', getAllGuests);
router.get('/payments', getAllPayments);

module.exports = router;
