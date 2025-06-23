import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material';
import MovieDetails from './MovieDetails';
import BookingForm from './BookingForm';
import { useApi } from '../../../hooks/useApi';
import { useParams } from 'react-router-dom';
import { MovieDetail } from '../../../types/movie.type';


const MovieBooking = () => {

    const [movieDetails, setMovieDetails] = useState<MovieDetail>({
        posterUrl: '',
        title: '',
        durationMinutes: '',
        description: '',
        language: '',
        genre: '',
        releaseDate: ''
    })

    const {movieId} = useParams<{movieId: string}>()
    // console.log(movieId)
    const {get} = useApi();

    useEffect(() => {
        const fetchTheaters = async () => {
            const res = await get<any>(`http://localhost:5000/movies/getById?movieId=${movieId}`);
            setMovieDetails(res.data[0]);
            // setCurrentTheater(''); // reset selected theater
        };

        fetchTheaters();
    }, []);

    return (
        <Box display="flex" height="100vh">
            {/* Left 30% - Movie Details */}
            <Box flex="0 0 30%" p={2} borderRight="1px solid #ccc">
                <MovieDetails 
                    movieDetails = {movieDetails}
                />
            </Box>

            {/* Right 70% - Booking Form */}
            <Box flex="1" p={2}>
                <BookingForm />
            </Box>
        </Box>
    )
}

export default MovieBooking