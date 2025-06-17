import { NextFunction, Request, Response } from "express";
import executeQuery from "../config/db";
import { sendResponse } from "../utils/responseHandler";


const _getAllMovies = () => `SELECT * FROM movies`;

const _getMovieByID = () => `SELECT * FROM movies where id = ?`

export const getAllMovies = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const moviesList = await executeQuery( _getAllMovies(), []);
        sendResponse(true, res, 200, moviesList, "Movies Successfull Fetched")
    } catch (error) {
        next(error)
    }
}


export const getMovieByID = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
try {
    const movieID = req.body.movieID;
    console.log(movieID)
    const movieDetails = await executeQuery(_getMovieByID(), [movieID])
    if(!movieDetails){
       sendResponse(true, res, 200, [], "No Movies Found") 
    }
    sendResponse(true, res, 200, movieDetails, "Movie Details fetched Successfully.")
} catch (error) {
    next(error)
}
}


module.exports = {getAllMovies, getMovieByID}