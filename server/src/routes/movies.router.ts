const express = require("express")
import {getMovies, getMovieByID, getTheatreLocations, getTheatres, getSeats, getBookedSeats, bookSeats} from "../controllers/movies.controller"

const router = express.Router();

router.get("/get", getMovies);
router.get("/getTheatreLocations", getTheatreLocations);
router.get("/getTheatres", getTheatres);
router.get("/getById", getMovieByID);
router.get("/getSeats", getSeats)
router.get("/getBookedSeats", getBookedSeats)
router.post("/bookseats", bookSeats)


module.exports = router