import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';

type MovieCardProps = {
  title: string;
  description: string;
  posterUrl: string;
};

const MovieCard: React.FC<MovieCardProps> = ({ title, description, posterUrl }) => {
  return (
    <Card sx={{ width: 250, height: 400, display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
      <CardMedia
        component="img"
        image={'https://upload.wikimedia.org/wikipedia/en/thumb/9/90/Thunderbolts%2A_poster.jpg/250px-Thunderbolts%2A_poster.jpg'}
        alt={title}
        sx={{ height: 300, objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <Typography variant="h6" noWrap>
          {title}
        </Typography>
        <Box sx={{ mt: 1, height: 70, overflow: 'hidden' }}>
          <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {description || 'No description available.'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MovieCard;
