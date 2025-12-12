var express = require('express');
var router = express.Router();
const auth = require('../middleware/auth');
const authController = require('../controllers/authController');

// Only admins can list all users
router.get('/', auth.verifyUser, auth.verifyAdmin, authController.getAllUsers);

module.exports = router;
