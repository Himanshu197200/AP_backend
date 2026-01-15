const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Legacy routes for Google Auth are deprecated/removed as Clerk handles this.
// router.post('/logout', authController.logout); // Handled by Clerk frontend
// router.get('/google', authController.googleLogin);
// router.get('/google/callback', authController.googleCallback);

router.get('/me', protect, authController.getMe);

module.exports = router;
