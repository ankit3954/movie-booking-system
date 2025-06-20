const express = require("express")
import {getMovies, getMovieByID, getTheatreLocations, getTheatres} from "../controllers/movies.controller"

const router = express.Router();

router.get("/get", getMovies);
router.get("/getTheatreLocations", getTheatreLocations);
router.get("/getTheatres", getTheatres);
router.get("/getById", getMovieByID);

module.exports = router