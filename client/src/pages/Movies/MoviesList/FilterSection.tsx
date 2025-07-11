import React from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Box,
  Button,
  Typography,
} from '@mui/material';
import { FilterSectionProps } from '../../../types/movie.type';


const FilterSection: React.FC<FilterSectionProps> = ({
  locations,
  theaters,
  currentLocation,
  currentTheater,
  handleLocationChange,
  handleTheaterChange,
  handleResetFilters,
}) => {
  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        backgroundColor: '#f5f5f5',
        borderRadius: 2,
        boxShadow: 1,
        // mt: 2,
      }}
    >
      <Typography variant="h6" sx={{ flexBasis: '100%' }}>
        Filter Movies
      </Typography>

      {/* Location Dropdown */}
      <FormControl sx={{ minWidth: 200 }} size="small">
        <InputLabel id="location-label">Location</InputLabel>
        <Select
          labelId="location-label"
          value={currentLocation}
          label="Location"
          onChange={handleLocationChange}
        >
          <MenuItem value="">All Locations</MenuItem>
          {locations.map((loc) => (
            <MenuItem key={loc.location} value={loc.location}>
              {loc.location}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Theater Dropdown */}
      <FormControl sx={{ minWidth: 200 }} size="small">
        <InputLabel id="theater-label">Theater</InputLabel>
        <Select
          labelId="theater-label"
          value={currentTheater}
          label="Theater"
          onChange={handleTheaterChange}
        >
          <MenuItem value="">All Theaters</MenuItem>
          {theaters.map((th) => (
            <MenuItem key={th.id} value={th.id}>
              {th.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Reset Filters Button */}
      {handleResetFilters && (
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          onClick={handleResetFilters}
        >
          Reset Filters
        </Button>
      )}
    </Box>
  );
};

export default FilterSection;
