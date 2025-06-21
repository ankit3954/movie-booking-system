import React, { useEffect, useState } from 'react'
import MoviesList from '../Movies/MoviesList/MoviesList'
import { useApi } from '../../hooks/useApi';
import { Movie } from "../../types/movie.type"
import { SelectChangeEvent } from '@mui/material';
import FilterSection from '../Movies/MoviesList/FilterSection';

const Home = () => {

  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentLocation, setCurrentLocation] = useState('');
  const [currentTheater, setCurrentTheater] = useState('');
  const [locations, setLocations] = useState([]);
  const [theaters, setTheaters] = useState([]);

  const { get } = useApi()


  const handleLocationChange = (event: SelectChangeEvent) => {
    setCurrentLocation(event.target.value);
    // optionally fetch/update theater options here
  };

  const handleTheaterChange = (event: SelectChangeEvent) => {
    setCurrentTheater(event.target.value);
  };

  const handleResetFilters = () => {
    setCurrentLocation('');
    setCurrentTheater('');
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      const locRes = await get<any>(
        "http://localhost:5000/movies/getTheatreLocations"
      )

      setLocations(locRes.data);

      const theRes = await get<any>(
        "http://localhost:5000/movies/getTheatres"
      )
      setTheaters(theRes.data);

      const movRes = await get<any>(
        "http://localhost:5000/movies/get"
      )
      setMovies(movRes.data);

      console.log(movRes, locRes, theRes)
    };

    fetchInitialData();
  }, []);


  useEffect(() => {
    const fetchTheaters = async () => {
      const res = await get<any>(`http://localhost:5000/movies/getTheatres?location=${currentLocation}`);
      setTheaters(res.data);
      setCurrentTheater(''); // reset selected theater
    };

    if (currentLocation) fetchTheaters();
  }, [currentLocation]);


  useEffect(() => {
    const fetchMovies = async () => {
      const params = new URLSearchParams();
      if (currentLocation) params.append('location', currentLocation);
      if (currentTheater) params.append('theaterId', currentTheater);

      const res = await get<any>(`http://localhost:5000/movies/get?${params.toString()}`);
      setMovies(res.data);
    };

    fetchMovies();
  }, [currentLocation, currentTheater]);


  return (
    <div>
      <FilterSection
        locations={locations}
        theaters={theaters}
        currentLocation={currentLocation}
        currentTheater={currentTheater}
        handleLocationChange={handleLocationChange}
        handleTheaterChange={handleTheaterChange}
        handleResetFilters={handleResetFilters}
      />
      <MoviesList movies={movies} />
    </div>
  )
}

export default Home