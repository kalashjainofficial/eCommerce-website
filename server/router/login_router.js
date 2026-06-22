const express = require('express');
const { if_user_exist } = require('../src/middlewares/Auth_middleware');
const { login } = require('../src/userData');

const router = express.Router();

router.get('/login', (req, res) => {
    res.send("login route");
});

router.post('/login', if_user_exist, login);

module.exports = router;

