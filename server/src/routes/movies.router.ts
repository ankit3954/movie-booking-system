const express = require("express")
import {getMovies, getMovieByID} from "../controllers/movies.controller"

const router = express.Router();

router.get("/get", getMovies);
router.get("/getById", getMovieByID);

module.exports = router