const router = require('express').Router({mergeParams:true})

const { auth } = require("../controllers/authController")
const validateTour = require("../middleware/validateTour")

const { createReview, deleteReview, readReviews } = require("../controllers/reviewController")


router
    .route("/:tid")
    .post(auth, validateTour, createReview)
    .delete(auth, deleteReview)

router
    .route("/")
    .get(auth, validateTour, readReviews)//all reviews for a single tour

module.exports = router