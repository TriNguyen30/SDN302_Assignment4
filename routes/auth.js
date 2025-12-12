var express = require('express');
var authRouter = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const auth = require('../middleware/auth');
authRouter.route('/login').post(authController.login);
authRouter.route('/register').post(authController.register);
authRouter.route('/users').get(auth.verifyUser, auth.verifyAdmin, authController.getAllUsers);
module.exports = authRouter;