import React, { useEffect, useState } from 'react'
import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material'
import { Grid } from "@mui/material"
import { useApi } from '../../../hooks/useApi'
import MovieCard from '../../../components/ui/MovieCard'
import { Movie } from '../../../types/movie.type'



type MoviesListProps = {
  movies: Movie[];
};

const MoviesList:React.FC<MoviesListProps> = ({movies}) => {

console.log("HI")
  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={2}>
        {movies && movies.map((movie) => (
          <Grid
            key={movie.movie_id}
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



