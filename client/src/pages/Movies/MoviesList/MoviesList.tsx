import React, { useEffect, useState } from 'react'
import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material'
import Grid from "@mui/material/Grid"
import { useApi } from '../../../hooks/useApi'
import MovieCard from '../../../components/ui/MovieCard'
import { Movie } from '../../../types/movie.type'



type MoviesListProps = {
  movies: Movie[];
};

const MoviesList:React.FC<MoviesListProps> = ({movies}) => {

  return (
    <Box sx={{ padding: 3}}>
      <Grid container spacing={2}>
        {movies && movies.map((movie) => (
          <Grid
            // item
            key={movie.movie_id}
            // xs={12} sm={6} md={4} lg={3} xl={2}
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



