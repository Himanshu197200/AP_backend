const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/logout', authController.logout);
router.get('/me', protect, authController.getMe);
router.get('/google', authController.googleLogin);
router.get('/google/callback', authController.googleCallback);

module.exports = router;
