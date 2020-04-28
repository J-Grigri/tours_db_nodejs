const Tour = require('../models/tour')


exports.createTour = async function (req, res, ) {
    try{
        const tour = await Tour.create({ ...req.body, organizer: req.user._id })
        res.status(201).json({ status: "success", data: tour });
    } catch (err) {
        console.log(err)
        res.status(401).json({ status: "fail", message: err.message });
    };
};
// Update or create a tour. If Id excists tour will be updated, otherwise created

exports.editTour = async function (req,res){
 
    try{
        
        const tour = await Tour.findOneAndUpdate(req.params.id,
            { ...req.body, user:req.user._id},
            {upsert:true, new: true, serDefaultsOnInsert: false});
        res.status(201).json({ status: "success", data: tour });
    } catch (err){
        console.log(err)
        res.status(401).json({ status: "fail", message: err.message });
    }
}

//list all tours 
exports.readTours = async function (req, res) {
    try {
        const tours = await Tour.find()
        res.json({ status: "success", data: tours });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

exports.deleteTour = async function (req, res){
    console.log("user id", req.user._id)
    console.log("magic", req.headers.authorization)
    try {
        await Tour.findOneAndDelete(req.params.id)
        return res.status(204).json({ status: "Deleted", data: null })
    } catch (err) {
        console.log(err)
        return res.status(400).json({status:"Failed", message:err.message})
    }
}
//Search tours by category
exports.searchByCategory = async function (req,res){
    try{
        const toursPerCat = await Tour.find({ categories: req.body.category})
        res.status(200).json({ status: "Success", data: toursPerCat})
    } catch (err){
        res.status(500).json({status:"Fail", error:err.message})
    }
}

exports.searchById = async function(req,res){
    try{
        const tour = await Tour.findById(req.params.id)
        res.status(200).json({ status: "Success", data: tour })
    } catch (err){
        res.status(500).json({ status: "Fail", error: err.message })
    }
}

