// const User = require ('../models/user')
const Review = require('../models/review')
const { deleteOne } = require("./handlerFactory");
const { updateOne } = require("./handlerFactory")

exports.deleteReview = deleteOne(Review);
exports.updateReview = updateOne(Review)

exports.createReview = async function (req, res) {
    try {
        const review = await Review.create(
            {...req.body,  user: req.user._id, tour: req.params.tid }
           )
        res.status(201).json({ status: "Success", data: review })
    } catch (err) {
        console.log(err)
        res.status(400).json({ status: "Fail", message: "Review could not created" })
    }
}

//read all reviews for a tour
exports.readReviews = async function (req, res) {
    try {
        const reviews = await Review.find({ tour: req.params.tid })
            //1st arg is the field, 2nd what to return in resx
            .populate("user", "id name")
            .populate("tour", "-guides -categories -user -createdAt -updatedAt")
        return res.status(200).json({ status: "ok", data: reviews })
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: "fail", error: error.message })
    }
}




