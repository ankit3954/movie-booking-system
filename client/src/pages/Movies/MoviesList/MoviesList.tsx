import React from 'react'
import { Box } from '@mui/material'
import Grid from "@mui/material/Grid"
import MovieCard from '../../../components/ui/MovieCard'
import { MoviesListProps } from '../../../types/movie.type'
import { useNavigate } from 'react-router-dom'


const MoviesList:React.FC<MoviesListProps> = ({movies, currentLocation}) => {

  const navigate = useNavigate()
  
  const handleClick = (movieId: string) => {
    navigate(`/movie/booking/${movieId}`, {
      state: {
        location: currentLocation
      }
    })
  }

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
              // movieId={movie.movie_id}
              handleClick = {() => handleClick(movie.movie_id)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default MoviesList



