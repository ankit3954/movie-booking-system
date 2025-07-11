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

type ScheduleEntry = {
  showTime: string;
  startTime: string;
  movieSchedule: string;
  theaterId: string;
};

type Schedules = {
  [theaterName: string]: ScheduleEntry[];
};

export type MovieDetail = {
    movieId: string;
    posterUrl: string;
    title: string;
    durationMinutes: string;
    description: string;
    language: string;
    genre: string;
    releaseDate: string;
    schedules: Schedules
};

export type BookingFormProps = {
    movieDetails: MovieDetail;
};

export type BookingState = {
    selectedCinema: string;
    selectedDate: string;
    selectedTimeSlot: string;
    selectedLanguage: string;
};

export type BookingStateKey = keyof BookingState;

export type BookingStep1Props = {
    movieDetails: MovieDetail;
    cinemas: string[];
    availableDates: string[];
    availableTimeSlots: string[];
    bookingState: BookingState;
    isStep1Valid: string;
    updateBookingState: (key: BookingStateKey, value: string) => void;
    handleNext: () => void;
    resetDependentFields: () => void;
}

export type BookingDialogProps = {
    isModalOpen: boolean;
    agreed: boolean;
    handleBookingDialog: (value: boolean) => void;
    handleAgreement: (value: boolean) => void;
    bookingState: BookingState;
    selectedSeats: BookedSeat[];
    movieDetails: MovieDetail;
    movieSchedule: string;
};

export type ScheduleDetails = {
    movieSchedule: string;
    theaterId: string;
}

export type BookingStep2Props = {
    handleBack: (step: number) => void;
    schedulesForTheater: ScheduleDetails[];
    bookingState: BookingState;
    movieDetails: MovieDetail;
    handleBookingState: (bookingState: BookingState) => void;
}

export type Seat = {
    id: string;
    seat_number: string;
    seat_type: string;
    is_booked?: boolean;
};

export type BookedSeat = {
    seat_number: string;
    id: string;
};

export type MovieCardProps = {
  title: string;
  description: string;
  posterUrl: string;
  // movieId: string;
  // handleClick: (movieId: string) => void;
  handleClick: () => void;
};


// Types
export type User = {
  username?: string;
  id: string;
};

export type LoginAndRegisterResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: string; // token
};

export type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<boolean>;
  logout: () => void;
  handleToken: (token: string) => void;
  loading: boolean;
  isAuthenticated: boolean;
};

export type LoginForm = {
  email: string;
  password: string;
}

export type RegisterForm = {
    username: string,
    email: string;
    password: string;
}


export type MovieDetailsProps = {
  movieDetails: MovieDetail
};

export type MoviesListProps = {
  movies: Movie[];
  currentLocation: string;
};