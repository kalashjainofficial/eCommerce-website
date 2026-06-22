const express = require('express');
const {if_user_exist} = require ('../src/middlewares/Auth_middleware')
const {sendotp} = require ('../src/userData')

const router = express.Router();
router.post('/sendotp',if_user_exist ,sendotp);

module.exports = router;