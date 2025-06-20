import { NextFunction, Request, Response } from "express";
import executeQuery from "../config/db";
import { sendResponse } from "../utils/responseHandler";


const _getMovies = () => `
    SELECT 
      m.id AS movie_id,
      m.title,
      m.description,
      m.duration_minutes,
      m.genre,
      m.language,
      m.release_date,
      t.name AS theater_name,
      t.location,
      ms.show_time,
      ms.start_time,
      ms.end_time
    FROM movies m
    JOIN movie_schedules ms ON m.id = ms.movie_id
    JOIN theaters t ON t.id = ms.theater_id
    WHERE 
      (? IS NULL OR t.location = ?)
      AND (? IS NULL OR t.id = ?)
`;

const _getMovieByID = () => `SELECT * FROM movies where id = ?`

const _getTheatreLocations = () => `
    SELECT 
    DISTINCT 
        location 
    FROM 
        theaters 
    WHERE 
        location 
    IS NOT NULL
`

const _getTheatre = () => `
    SELECT 
        id, 
        name 
    FROM 
        theaters
`

export const getMovies = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { location, theaterId } = req.query;
        const values = [location, location, theaterId, theaterId];
        const moviesList = await executeQuery(_getMovies(), values);
        sendResponse(true, res, 200, moviesList, "Movies Successfully Fetched")
    } catch (error) {
        next(error)
    }
}

export const getTheatres = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { location } = req.query;
        let query = _getTheatre()
        let values = [];
        if (location) {
            query += ` WHERE location = ?`;
            values.push(location);
        }
        const theatreList = await executeQuery(query, values);

        sendResponse(true, res, 200, theatreList, "Theatre Successfully Fetched")
    } catch (error) {
        next(error)
    }
}

export const getTheatreLocations = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const locationList = await executeQuery(_getTheatreLocations(), []);
        sendResponse(true, res, 200, locationList, "Locations Successfully Fetched")
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
        if (!movieDetails) {
            sendResponse(true, res, 200, [], "No Movies Found")
        }
        sendResponse(true, res, 200, movieDetails, "Movie Details fetched Successfully.")
    } catch (error) {
        next(error)
    }
}


module.exports = { getMovies, getMovieByID, getTheatreLocations, getTheatres }