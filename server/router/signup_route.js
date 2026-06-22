const express = require('express');
const router = express.Router();


const {if_user_exist} = require( "../src/middlewares/Auth_middleware");
const {signup} = require( "../src/userData");



router.get('/signup', (req, res) => {
    res.send("signup route");
});

router.post('/signup',if_user_exist ,signup);

module.exports = router;