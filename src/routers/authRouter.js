const router = require('express').Router()

const { auth, login, logout } = require("../controllers/authController")

router.post("/login", login);//no auth here!
router.get("/logout", auth, logout);

module.exports = router