
const express = require('express');
const {if_user_exist} = require("../src/middlewares/Auth_middleware")
const {forgotpass} = require("../src/userData")


const router =  express.Router();

// FORGOT PASSWORD
router.get('/forgotpass', (req, res) => {
    res.send("forgotpass");
});

router.post('/forgotpass', if_user_exist,forgotpass);


module.exports = router;