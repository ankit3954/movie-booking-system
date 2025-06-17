const express = require("express")
import {getAllMovies, getMovieByID} from "../controllers/movies.controller"

const router = express.Router();

router.get("/getAll", getAllMovies);
router.get("/getById", getMovieByID);

module.exports = router