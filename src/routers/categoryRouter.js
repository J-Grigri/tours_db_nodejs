const router = require('express').Router()

const { createCategory, readCategory } = require("../controllers/categoryController")

router
    .route("/")
    .post(createCategory)
    .get(readCategory)

module.exports = router