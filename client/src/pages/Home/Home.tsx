import React, { useEffect, useState } from 'react'
import MoviesList from '../Movies/MoviesList/MoviesList'
import { useApi } from '../../hooks/useApi';
import { AppData, Location, Movie, Theater } from "../../types/movie.type"
import { SelectChangeEvent } from '@mui/material';
import FilterSection from '../Movies/MoviesList/FilterSection';


const Home = () => {

  const [data, setData] = useState<AppData>({
    locations: [],
    theaters: [],
    movies: [],
  });
  const [currentLocation, setCurrentLocation] = useState('');
  const [currentTheater, setCurrentTheater] = useState('');

  const { get } = useApi()

  const handleLocationChange = (event: SelectChangeEvent) => {
    setCurrentLocation(event.target.value);
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
      const [locRes, theRes, movRes] = await Promise.all([
        get<any>('http://localhost:5000/movies/getTheatreLocations'),
        get<any>('http://localhost:5000/movies/getTheatres'),
        get<any>('http://localhost:5000/movies/get'),
      ]);

      setData({
        locations: locRes.data,
        theaters: theRes.data,
        movies: movRes.data,
      });

      // console.log(movRes, locRes, theRes)
    };

    fetchInitialData();
  }, []);


  useEffect(() => {
    const fetchTheaters = async () => {
      const res = await get<any>(`http://localhost:5000/movies/getTheatres?location=${currentLocation}`);
      setData((prevData) => ({
        ...prevData,
        theaters: res.data
      }));
      setCurrentTheater(''); // reset selected theater
    };

    fetchTheaters();
  }, [currentLocation]);


  useEffect(() => {
    const fetchMovies = async () => {
      const params = new URLSearchParams();
      if (currentLocation) params.append('location', currentLocation);
      if (currentTheater) params.append('theaterId', currentTheater);

      const res = await get<any>(`http://localhost:5000/movies/get?${params.toString()}`);
      setData((prevData) => ({
        ...prevData,
        movies: res.data
      }));
    };

    fetchMovies();
  }, [currentLocation, currentTheater]);

console.log("HI")
  return (
    <>
      <FilterSection
        locations={data.locations}
        theaters={data.theaters}
        currentLocation={currentLocation}
        currentTheater={currentTheater}
        handleLocationChange={handleLocationChange}
        handleTheaterChange={handleTheaterChange}
        handleResetFilters={handleResetFilters}
      />
      <MoviesList movies={data.movies} />
    </>
  )
}

export default Home

