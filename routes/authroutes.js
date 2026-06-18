const express = require('express');
const router = express.Router();
const protect = require("../middleware/authmiddleware");
const {registerUser,LoginUser,getProfile} = require('../controllers/authcontroller');

router.post('/register',registerUser);
router.post('/Login',LoginUser);
router.get('/profile',protect, getProfile);

module.exports = router;