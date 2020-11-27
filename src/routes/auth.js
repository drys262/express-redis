const express = require('express');
const router = express.Router();
const sessionChecker = require('../middlewares/session-checker');

const AuthController = require('../controllers/auth');

router.get('/signin', sessionChecker, AuthController.signIn);
router.get('/logout', AuthController.signOut);
router.post('/signin', AuthController.postSignIn);

module.exports = router;
