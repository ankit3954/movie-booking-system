const express = require("express")
import {getMovies, getMovieByID, getTheatreLocations, getTheatres, getSeats, getBookedSeats} from "../controllers/movies.controller"

const router = express.Router();

router.get("/get", getMovies);
router.get("/getTheatreLocations", getTheatreLocations);
router.get("/getTheatres", getTheatres);
router.get("/getById", getMovieByID);
router.get("/getSeats", getSeats)
router.get("/getBookedSeats", getBookedSeats)
module.exports = router