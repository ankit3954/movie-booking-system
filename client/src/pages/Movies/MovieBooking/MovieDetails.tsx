import React from 'react';
import {Typography, Card, CardMedia, CardContent } from '@mui/material';
import { MovieDetail } from '../../../types/movie.type';

type MovieDetailsProps = {
  movieDetails: MovieDetail
};

const MovieDetails: React.FC<MovieDetailsProps> = ({
  movieDetails
}) => {
    const {posterUrl, title, durationMinutes, language, genre, description} = movieDetails;
  return (
    <Card elevation={3} sx={{ maxWidth: '100%' }}>
      <CardMedia
        component="img"
        height="300"
        image={posterUrl ? posterUrl : 'https://upload.wikimedia.org/wikipedia/en/thumb/9/90/Thunderbolts%2A_poster.jpg/250px-Thunderbolts%2A_poster.jpg'}
        alt={title}
      />
      <CardContent>
        <Typography variant="h5" gutterBottom>{title}</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Duration: {durationMinutes}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Language: {language}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Genre: {genre}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>{description}</Typography>
      </CardContent>
    </Card>
  );
};

export default MovieDetails;
