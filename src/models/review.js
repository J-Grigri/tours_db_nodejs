const mongoose = require('mongoose')
const User = require('./user')
const Tour = require('./tour')

const schema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "Review must have user associated with it"]
    },
    tour:{ 
        type: mongoose.Schema.ObjectId,
        ref:"Tour",
        // required:[true, "Review must contain tour ID"]

    },
    content: {
        type: String,
        required: [true,"review must have a montent"],
        minlength: 5
    },
    rating: {
        type: Number,
        required: [true, "Review needs a rating"],
        min:1,
        max:5
    }
},{
    timestamp: true,
    toJSON: { virtuals: true},
    toObject: { virtuals: true}
})


//calculate rating and save to db
schema.statics.calculateAvgRating = async function(tourId){
    //find all reviews that have the tour:tourId
    //generate a new object

    const stats = await this.aggregate([
        {$match : {tour: tourId}}, // returns array
        {$group : {
            _id: "$tour",
            ratingQuantity: { $sum: 1  } , //number docs found
            ratingAverage: { $avg: "$rating" } //average of field 'rating' in all the found docs
        }} 
    ])
    //save data.ternary operator here is to prevent undefined error if there is no review left after deleting last review. 
    await mongoose.model("Tour").findByIdAndUpdate(tourId,{
        ratingAverage: stats.length === 0 ? 0 : stats[0].ratingAverage ,
        ratingQuantity: stats.length === 0 ? 0 : stats[0].ratingQuantity
    })
}
//Doc middleware pre save
schema.post("save", async function(){
    //this = doc (instance)
    await this.constructor.calculateAvgRating(this.tour)
})

//Any of the ^findOneAnd (crud) review changes will go through here
schema.pre(/^findOneAnd/, async function(next){
    //this = query
    //attach review doc to the query
    this.doc = await this.findOne();
    next()
})
//calculate new avg rating after change
schema.post(/^findOneAnd/, async function(){
    //this.doc is now the same as this inside schema.post("save")
    await this.doc.constructor.calculateAvgRating(this.doc.tour)
})

const Review = mongoose.model("Review", schema);
module.exports = Review