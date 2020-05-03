
require("dotenv").config()
const mongoose = require("mongoose")
const bodyParser = require('body-parser')
const { createUser, getUsers, userTours, updateProfile } = require("./src/controllers/UserController")
const { auth, login, logout } = require("./src/controllers/authController")
const { createTour, readTours, editTour, deleteTour, searchByCategory, searchById, searchMyTours } = require("./src/controllers/tourController")
const { createCategory, readCategory } = require("./src/controllers/categoryController")
const { createReview, readReviews, deleteReview } = require('./src/controllers/reviewController')
const validateTour = require('./src/middleware/validateTour')

const express = require("express")
const app = express();
const router = express.Router();


mongoose.connect(process.env.DB_LOCAL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => console.log("successfully connected to database")).catch(err => console.log(err, ))

app.use(bodyParser.urlencoded({ extended: false })); app.use(bodyParser.json());
app.use(bodyParser.json());
app.use(router);

app.get("/", (req, res) => { res.status(200).json({ status: "ok", data: [] }) })

router.post("/login", login);//no auth here!
router.get("/logout", auth, logout);


router.route("/tours/category")
    .post(createCategory)
    .get(readCategory)

router.route("/tours/mytours")
    .get(auth, searchMyTours)

router.route("/tours/:id/reviews")
    .post(auth, validateTour, createReview)
    .get(auth, readReviews)//all reviews for a single tour
    .delete(auth, deleteReview)

router.route("/tours/:id/edit")
    .put(auth, validateTour, editTour)

router.delete("/tours/:id", auth, deleteTour)

router.route("/tours/create")
    .post(auth, createTour)

//List all tours
router.route("/tours/list/all")
    .get(auth, readTours)

router.route("/tours/list/category")
    .get(auth, searchByCategory)

router.route("/tours/list/user")
    .get(auth, userTours)

//Search user tours by id
// router.route("/tours/list/user/:id")
//     .get(auth, readUserTours)

// search tours by id
router.route("/tours/list/:id")
    .get(auth, searchById)

router.route("/tours/list/all")
    .get(auth, readTours)

router.route("/user/profile/update")
    .put(auth, updateProfile )

router.route("/users/all")
    .get(auth, getUsers)

router.route("/register")
    .post(createUser)







app.listen(process.env.PORT, () => {
    console.log("app is running on port ", process.env.PORT);
})