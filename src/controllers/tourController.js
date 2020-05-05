const Tour = require('../models/tour')

//Delete a tour
const { deleteOne } = require("./handlerFactory");
exports.deleteTour = deleteOne(Tour);
//Update tour
const { updateOne } = require("./handlerFactory")
exports.editTour = updateOne(Tour)

exports.createTour = async function (req, res, ) {
    try{
        const tour = await Tour.create({ ...req.body, user: req.user._id })
        res.status(201).json({ status: "success", data: tour });
    } catch (err) {
        console.log(err)
        res.status(401).json({ status: "fail", message: err.message });
    };
};

// Update or create a tour. If Id excists tour will be updated, otherwise created
// exports.editTour = async function (req,res){
//     try{
//         const tour = await Tour.findOneAndUpdate(req.params.id,
//             { ...req.body, user:req.user._id},
//             {upsert:true, new: true, serDefaultsOnInsert: false});
//         res.status(201).json({ status: "success", data: tour });
//     } catch (err){
//         console.log(err)
//         res.status(401).json({ status: "fail", message: err.message });
//     }
// }

//list all tours 
exports.readTours = async function (req, res) {
    try {
        const tours = await Tour.find()
        console.log("here",tours)
        res.json({ status: "success", data: tours });
    } catch (error) {
        res.status(400).json({ status: "failure", message: error.message });
    }
};



//Search tours by category
exports.searchByCategory = async function (req,res){
    const { category } = req.body
    try{
        const toursPerCat = await Tour.find({ categories: category})
        res.status(200).json({ status: "Success", data: toursPerCat})
    } catch (err){
        res.status(501).json({status:"Fail", error:err.message})
    }
}

//Search tours by tourId
exports.searchById = async function(req,res){
    try{
        const tour = await Tour.findById(req.params.id)
        res.status(200).json({ status: "Success", data: tour })
    } catch (err){
        res.status(502).json({ status: "Fail", error: err.message })
    }
}

//list tours based on User ID
exports.searchMyTours = async function (req, res) {
    try {
        const tours = await Tour.find({ user: req.user.id })
        console.log(req.user.id, "Nam nam")
        res.status(200).json({ status: "Success", data: tours })
    } catch (err) {
        console.log(err)
        res.status(503).json({ status: "Failzz", error: err.message })
    }
}


