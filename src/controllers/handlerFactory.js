// const catchAsync = require("../utils/catchAsync")


//Delete single item
exports.deleteOne = Model => async (req, res) => {
    try {
        let id;
        switch (Model.modelName){
            case "Review":
            id = req.params.id
            break;
            case "Tour":
            id = req.params.id
            break;
            default:
            id = params.id
        }
        await Model.findOneAndDelete({ _id: id })
        res.status(204).end()
    } catch (err) {
        res.status(400).json({ status: "Fail", message: err.message })
    }
}

exports.updateOne = Model => async (req, res) => {
    try{
        let allows = []
        let id;
        switch (Model.modelName) {
            case "Review":
               allows = ["content", "rating"]
                id = req.params.id
                break;
            case "Tour":
                allows = ["title", "description", "guides", "duration", "price", "categories"]
                id = req.params.id
                break;
            case "User":
                allows = ["password"]
                id = req.user.id
                break;
            default:
                allows = [];
                id = req.params.id
        }
        //return array of fields inside req.body
        Object.keys(req.body).forEach(el=>{
            if (!allows.includes(el))//delete el that are not in allows[]
            delete req.body(el)
        });
        console.log(req.body)
        const newItem = await Model.findOneAndUpdate({_id:id}, req.body, {new: true})

        res.status(200).json({status: "ok", data: newItem})
    } catch (error) {
        console.log(error)
        res.status(400).json({status: "Fail", message: error.message})
    }
    }