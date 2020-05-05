const mongoose = require('mongoose')
const User = require("../models/user")
const Category = require("../models/category")

const tourSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "User must have a name"],
        trim: true,
        unique: true
    },
    description: {
        type: String,
        minLength: 10,
    },
    //single object
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        require: [true, "Tour must have an user"]
    },
    duration: {
        type: Number,
        required: [true, "Tour must have a duration"],
    },
    price: {
        type: Number,
        required: [true, "Tour must have a price"],
        min: 0
    },
    //Array of ID's / chinpmld referencing:
    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        }
    ],
    ratingAverage: {
        type: Number,
        default: 0,
        min: [0, "Rating must be above 0"],
        max: [5, "Rating must be below 5.0"],
        set: value => Math.round(value * 10) / 10
    },
    ratingQuantity: {
        type: Number,
        default: 0
    },
    categories: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Category",
            // require: [true, "Tour must have at least one category"]
        }
    ],
}, {
    timestamps: true,//createdAt and editedAt
    toJSON: { virtuals: true },//data which are not stored directly in our database(e.g. firstName+lastName)
    toObject: { virtuals: true }//raw object from an instance of a class (model) without additional keys,
})

// check if userIDs are correct before saving
tourSchema.pre("save", async function (next) {
    //check if the field "guides" excist
    if (!this.isModified("guides")) return next();

    const found = await User.find({ "_id": { $in: this.guides } }).select("_id");
    if (found.length !== this.guides.length)
        throw new Error("guide(s) doesn't exist");
    next();
})

//create temporary or virtual field which does not not hold data in db
tourSchema.virtual('reviews',{
    ref:"Review",
    localField:"_id",
    foreignField: "tour",
    count: true
});

//modify which fields should be shown
tourSchema.pre(/^find/, function (next) {
    this
        .populate("user", "-email -__v -tokens -createdAt -updatedAt -password ")//specify which fields to hide. same as below
        .populate("guides", "_id name")
        .populate("categories", "_id country")
    next();
});

const Tour = mongoose.model("Tour", tourSchema)
module.exports = Tour

