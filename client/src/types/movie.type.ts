import { SelectChangeEvent } from "@mui/material";

export type Movie = {
  movie_id: string;
  title: string;
  description: string;
  duration_minutes: number;
  genre: string;
  language: string;
  release_date: string; // ISO 8601 string
  poster_url: string;
  theater_names: string[]; // array of theater names
  theater_locations: string[]; // array of theater locations
  show_times: string[]; // array of date strings (e.g., '2025-06-21')
  first_start_time: string; // e.g., '09:00:00'
  last_end_time: string;    // e.g., '22:48:00'
};

export type Location = {
  location: string;
};

export type Theater = {
  id: string;
  name: string;
};

export type FilterSectionProps = {
  locations: Location[];
  theaters: Theater[];
  currentLocation: string;
  currentTheater: string;
  handleLocationChange: (event: SelectChangeEvent) => void;
  handleTheaterChange: (event: SelectChangeEvent) => void;
  handleResetFilters?: () => void;
};

export type AppData = {
  locations: Location[];
  theaters: Theater[];
  movies: Movie[];
};