import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import { executeQuery, executeTransaction } from "../config/db";
import { sendResponse } from "../utils/responseHandler";
import { nextTick } from "process";


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
          'movieSchedule', ms_inner.id,
          'showTime', ms_inner.show_time,
          'startTime', ms_inner.start_time,
          'theaterId', ms_inner.theater_id
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

const _getSeats = () => `
    select
        id,
        seat_number,
        seat_type
    from
        seats
    where
        seats.theater_id = ?
    order by
        seat_number;
`

const _getBookedSeats = () => `
    select
        s.id,
        s.seat_number
    from
        seats s
    join booking_seats bs on
        s.id = bs.seat_id
    join bookings b on
        bs.booking_id = b.id
    where
        b.schedule_id = ? and b.status = 'booked'
    order by
        s.seat_number ;
`

const _saveBooking = () => `
    insert
        into
        bookings (id,
        user_id,
        schedule_id,
        total_amount,
        status)
    values (?,?,?,?,?);
`

const _getBookingId = () => `
    select
        id
    from
        bookings
    where
        schedule_id = ?
        and user_id = ?
    order by
        booking_time
    desc;
`

const _saveBookedSeats = () => `
    insert
        into
        booking_seats (booking_id,
        seat_id)
    values (?,?);
`

const _updateBookingStatus = () => `
    update
	bookings
set
	status = 'booked'
where
	id = ?
`

const _getBookingDetails = () =>   `
SELECT 
  b.id AS bookingId,
  u.username as userName, 
  u.email AS userEmail,
  m.title AS movieName, 
  t.name AS theaterName,
  ms.show_time AS showTime, 
  ms.start_time AS startTime,
  JSON_ARRAYAGG(s.seat_number) AS seats
FROM bookings b
JOIN users u ON b.user_id = u.id
JOIN movie_schedules ms ON ms.id = b.schedule_id
JOIN movies m ON m.id = ms.movie_id
JOIN theaters t ON t.id = ms.theater_id
JOIN booking_seats bs ON bs.booking_id = b.id
JOIN seats s ON s.id = bs.seat_id 
WHERE b.id = ?
GROUP BY b.id;
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
        const { movieId, location } = req.query;
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

export const getSeats = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { theaterId } = req.query;
        // console.log(theaterId)
        const seats = await executeQuery(_getSeats(), [theaterId]);

        if (!seats) {
            sendResponse(true, res, 200, {}, "No seats Found")
        }

        sendResponse(true, res, 200, seats, "Seats Fetched Successfully")
    } catch (error) {
        next(error)
    }
}


export const getBookedSeats = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { movieScheduleId } = req.query;
        // console.log(movieScheduleId)
        const bookedSeats = await executeQuery(_getBookedSeats(), [movieScheduleId]);

        if (!bookedSeats) {
            sendResponse(true, res, 200, {}, "No seats are booked")
        }

        sendResponse(true, res, 200, bookedSeats, "Booked Seats Fetched Successfully")
    } catch (error) {
        next(error)
    }
}

export const bookSeats = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { userId, movieScheduleId, totalAmount, status, seatIds } = req.body;

        const bookingId = uuidv4();

        const queries = [
            {
                query: _saveBooking(),
                values: [bookingId, userId, movieScheduleId, totalAmount, status],
            },
            ...seatIds.map((seatId: any) => ({
                query: _saveBookedSeats(),
                values: [bookingId, seatId],
            })),
        ];

        await executeTransaction(queries);
        // const saveBooking = await executeQuery(_saveBooking(), [userId, movieScheduleId, totalAmount, status])
        // console.log(saveBooking)

        // const bookingId = await executeQuery(_getBookingId(), [movieScheduleId, userId]);
        // // console.log(bookingId)
        // const recentBookingId = bookingId[0].id;
        // // console.log(seatIds)
        // seatIds.forEach(async (seatId: any) => {
        //     await executeQuery(_saveBookedSeats(), [recentBookingId, seatId]);
        // });

        sendResponse(true, res, 201, {bookingId, seatIds}, "Booking Confirmed")
        // const saveBookedSeats = await executeQuery(_saveBookedSeats(), [bookingId, seatId]);
    } catch (error) {
        next(error)
    }
}

export const updateBookingsStatus = async (bookingId: string) => {
    try {
        const updateStatus = await executeQuery(_updateBookingStatus(), [bookingId])
    } catch (error) {
        console.error(error)
    }
}


export const getBookingDetails = async(
    bookingId: string
) => {
    try {
        const bookingDetails = await executeQuery(_getBookingDetails(), [bookingId])
        return bookingDetails
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    getMovies,
    getMovieByID,
    getTheatreLocations,
    getTheatres,
    getSeats,
    getBookedSeats,
    bookSeats,
    updateBookingsStatus,
    getBookingDetails
}

