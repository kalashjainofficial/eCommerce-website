const express = require("express")
const {logout} = require("../src/userData")
const router = express.Router()

router.post("/logout", logout);
module.exports = router   