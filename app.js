require("dotenv").config()
const mongoose = require("mongoose")
const bodyParser = require('body-parser')
const express = require("express")
const app = express();
const router = express.Router();

//database connection
mongoose.connect(process.env.DB_LOCAL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => console.log("successfully connected to database")).catch(err => console.log(err, ))

app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());


// app.get("/", (req, res) => { res.status(200).json({ status: "ok", data: [] }) })

//Routers
const userRouter = require("./src/routers/userRouter")
const tourRouter = require("./src/routers/tourRouter")
const reviewRouter = require("./src/routers/reviewRouter")
const authRouter = require("./src/routers/authRouter")
const categoryRouter = require("./src/routers/categoryRouter")

app.use(router);
router.use("/users", userRouter)
router.use("/tours", tourRouter)
router.use("/tours/:tid/reviews", reviewRouter)
router.use("/auth", authRouter)
router.use("/categories", categoryRouter)

app.listen(process.env.PORT, () => {
    console.log("app is running on port ", process.env.PORT);
})