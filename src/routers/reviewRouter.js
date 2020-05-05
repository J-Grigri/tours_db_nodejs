const router = require('express').Router({mergeParams:true})

const { auth } = require("../controllers/authController")
const validateTour = require("../middleware/validateTour")

const { createReview, deleteReview, readReviews, updateReview } = require("../controllers/reviewController")


router
    .route("/:id")
    .patch(auth, validateTour, updateReview)
    .delete(auth, deleteReview)
    
router
    .route("/")
    .get(auth, validateTour, readReviews)//all reviews for a single tour
    .post(auth, createReview)

module.exports = router