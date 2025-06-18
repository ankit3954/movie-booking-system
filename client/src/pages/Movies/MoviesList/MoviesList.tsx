import React, { useEffect, useState } from 'react'
import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material'
import { Grid } from "@mui/material"
import { useApi } from '../../../hooks/useApi'
import MovieCard from './MovieCard'


type Movie = {
  id: number
  title: string
}


const MoviesList = () => {

  const [movies, setMovies] = useState<any[]>([]);
  const { get } = useApi()

  useEffect(() => {
    const getMovies = async () => {
      try {
        const movies = await get<any>(
          "http://localhost:5000/movies/getAll"
        )
        setMovies(movies.data);
      } catch (error) {
        console.log(error)
      }
    }

    getMovies()
  }, [])

console.log(movies)
  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={2}>
        {movies && movies.map((movie) => (
          <Grid
            key={movie.id}
            sx={{
              flexBasis: '20%',
              maxWidth: '20%',
            }}
          >
            <MovieCard
              title={movie.title}
              description={movie.description}
              posterUrl={movie.poster_url}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default MoviesList