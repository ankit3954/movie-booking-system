import { useEffect, useState } from 'react'
import { Box } from '@mui/material';
import MovieDetails from './MovieDetails';
import BookingForm from './BookingForm';
import { useApi } from '../../../hooks/useApi';
import { useParams, useLocation } from 'react-router-dom';
import { MovieDetail } from '../../../types/movie.type';


const MovieBooking = () => {

    const [movieDetails, setMovieDetails] = useState<MovieDetail>({
        movieId: '',
        posterUrl: '',
        title: '',
        durationMinutes: '',
        description: '',
        language: '',
        genre: '',
        releaseDate: '',
        schedules: {}
    })

    const { movieId } = useParams<{ movieId: string }>()
    const location = useLocation();
    const currentLocation = location.state?.location;
    const { get } = useApi();

    useEffect(() => {
        const fetchMovieDetails = async () => {
            let url = `http://localhost:5000/movies/getById?movieId=${movieId}`;

            if (currentLocation.trim() !== '') {
                url += `&location=${encodeURIComponent(currentLocation)}`;
            }
            const res = await get<any>(url);
            setMovieDetails(res.data);
        };

        fetchMovieDetails();
    }, []);




    return (
        <Box display="flex" height="100vh">
            <Box
                flex="0 0 30%"
                p={2}
                borderRight="1px solid #ccc"
                overflow="hidden"
                sx={{
                    position: "sticky",
                    top: 0,
                    height: "100vh"
                }}
            >
                <MovieDetails
                    movieDetails={movieDetails}
                />
            </Box>
            <Box
                flex="1"
                p={2}
                sx={{
                    overflowY: 'auto',
                    height: '100vh',
                }}
            >
                <BookingForm
                    movieDetails={movieDetails}
                />
            </Box>
        </Box>
    )
}

export default MovieBooking