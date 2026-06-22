const express = require("express");
const {handleGoogleLogin} = require("../src/userData")

const router = express.Router();

// login with google 
router.post('/googlelogin' , handleGoogleLogin )

module.exports = router;

