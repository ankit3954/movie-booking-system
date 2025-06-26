import { NextFunction, Request, Response } from "express";
import executeQuery from "../config/db";
import { sendResponse } from "../utils/responseHandler";


// const _getMovies = () => `
//     SELECT 
//       m.id AS movie_id,
//       m.title,
//       m.description,
//       m.duration_minutes,
//       m.genre,
//       m.language,
//       m.release_date,
//       m.poster_url,
//       t.name AS theater_name,
//       t.location,
//       ms.show_time,
//       ms.start_time,
//       ms.end_time
//     FROM movies m
//     JOIN movie_schedules ms ON m.id = ms.movie_id
//     JOIN theaters t ON t.id = ms.theater_id
//     WHERE 
//       (? IS NULL OR t.location = ?)
//       AND (? IS NULL OR t.id = ?)
// `;


const _getMovies = () => `
  SELECT 
    m.id AS movie_id,
    m.title,
    m.description,
    m.duration_minutes,
    m.genre,
    m.language,
    m.release_date,
    m.poster_url,
    GROUP_CONCAT(DISTINCT t.name) AS theater_names,
    GROUP_CONCAT(DISTINCT t.location) AS theater_locations,
    GROUP_CONCAT(DISTINCT ms.show_time ORDER BY ms.show_time) AS show_times,
    MIN(ms.start_time) AS first_start_time,
    MAX(ms.end_time) AS last_end_time
  FROM movies m
  JOIN movie_schedules ms ON m.id = ms.movie_id
  JOIN theaters t ON t.id = ms.theater_id
  WHERE 
    (? IS NULL OR LOWER(t.location) = LOWER(?))
    AND (? IS NULL OR t.id = ?)
  GROUP BY m.id
`;

const _getMovieByID = () => `
 SELECT
  m.id AS movieId,
  m.title,
  m.description,
  m.duration_minutes AS durationMinutes,
  m.genre,
  m.language,
  m.release_date AS releaseDate,
  m.poster_url AS posterUrl,
  JSON_OBJECTAGG(
    t.name,
    (
      SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
          'showTime', ms_inner.show_time,
          'startTime', ms_inner.start_time
        )
      )
      FROM movie_schedules ms_inner
      WHERE ms_inner.movie_id = m.id AND ms_inner.theater_id = t.id
    )
  ) AS schedules
FROM movies m
JOIN movie_schedules ms ON m.id = ms.movie_id
JOIN theaters t ON t.id = ms.theater_id
WHERE
  m.id = ? AND (? IS NULL OR LOWER(t.location) = LOWER(?))
GROUP BY m.id;
`

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
        const { theaterId } = req.query;
        const location = req.query.location?.toString().toLowerCase() ?? null;
        const values = [location, location, theaterId, theaterId];
        const moviesList = await executeQuery(_getMovies(), values);

        const formatted = moviesList.map((movie: { show_times: string; theater_names: string; theater_locations: string; }) => ({
            ...movie,
            show_times: movie.show_times?.split(',') ?? [],
            theater_names: movie.theater_names?.split(',') ?? [],
            theater_locations: movie.theater_locations?.split(',') ?? [],
        }));
        sendResponse(true, res, 200, formatted, "Movies Successfully Fetched")
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
        const {movieId, location} = req.query;
        // console.log(movieId)
        const result = await executeQuery(_getMovieByID(), [movieId, location, location])
        const movieDetails = result[0]
        if (!movieDetails) {
            sendResponse(true, res, 200, {}, "No Movies Found")
        }
        // console.log(movieDetails)
        sendResponse(true, res, 200, movieDetails, "Movie Details fetched Successfully.")
    } catch (error) {
        next(error)
    }
}


module.exports = { getMovies, getMovieByID, getTheatreLocations, getTheatres }