import React, { useState, useMemo } from 'react';
import {
    Box,
    Typography,
    Button,
    ToggleButtonGroup,
    ToggleButton,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { MovieDetail } from '../../../types/movie.type';
import BookingStep1 from '../../../components/ui/BookingStep1';
import BookingStep2 from '../../../components/ui/BookingStep2';

type BookingFormProps = {
    movieDetails: MovieDetail;
};

const getUnique = (arr: string[]) => Array.from(new Set(arr));

const BookingForm: React.FC<BookingFormProps> = ({ movieDetails }) => {
    const [step, setStep] = useState(1);
    const [selectedCinema, setSelectedCinema] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('');

    const cinemas = useMemo(() => Object.keys(movieDetails.schedules || {}), [movieDetails]);

    const availableDates = useMemo(() => {
        if (!selectedCinema) return [];
        const entries = movieDetails.schedules[selectedCinema] || [];
        return getUnique(entries.map((e) => e.showTime));
    }, [selectedCinema, movieDetails]);

    const availableTimeSlots = useMemo(() => {
        if (!selectedCinema || !selectedDate) return [];
        const entries = movieDetails.schedules[selectedCinema] || [];
        return getUnique(
            entries
                .filter((e) => e.showTime === selectedDate)
                .map((e) => e.startTime)
        );
    }, [selectedCinema, selectedDate, movieDetails]);

    const isStep1Valid = selectedCinema && selectedDate && selectedTimeSlot && selectedLanguage;

    const handleNext = () => {
        if (isStep1Valid) setStep(2);
    };

    const handleBack = (step: number) => {
        setStep(step)
    }

    const handleSelectedCinema = (cinema: string) => {
        setSelectedCinema(cinema)
    }

    const handleSelectedDate = (date: string) => {
        setSelectedDate(date)
    }

    const handleSelectedTimeSlot = (timeSlot: string) => {
        setSelectedTimeSlot(timeSlot)
    }

    const handleSelectedLanguage = (language: string) => {
        setSelectedLanguage(language)
    }

    const resetDependentFields = () => {
        setSelectedDate('');
        setSelectedTimeSlot('');
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box p={3}>
                <Typography variant="subtitle1" gutterBottom>
                    Step {step} of 2
                </Typography>
                {step === 1 &&
                    <BookingStep1
                    movieDetails={movieDetails}
                    cinemas={cinemas}
                    availableDates={availableDates}
                    availableTimeSlots={availableTimeSlots}
                    selectedCinema={selectedCinema}
                    selectedDate={selectedDate}
                    selectedTimeSlot={selectedTimeSlot}
                    selectedLanguage={selectedLanguage}
                    isStep1Valid={isStep1Valid}
                    handleSelectedCinema={handleSelectedCinema}
                    handleSelectedDate={handleSelectedDate}
                    handleSelectedTimeSlot={handleSelectedTimeSlot}
                    handleSelectedLanguage={handleSelectedLanguage}
                    handleNext={handleNext}
                    resetDependentFields={resetDependentFields}
                    />
                }
                {step === 2 && <BookingStep2 handleBack={handleBack} />}

                {/* {step === 1 && (
          <>
            <Typography variant="h6" gutterBottom>
              Select Cinema
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
              {cinemas.map((cinema) => (
                <Button
                  key={cinema}
                  variant={selectedCinema === cinema ? 'contained' : 'outlined'}
                  onClick={() => {
                    setSelectedCinema(cinema);
                    resetDependentFields();
                  }}
                  sx={{ minWidth: 120, flexGrow: 1 }}
                  aria-pressed={selectedCinema === cinema}
                >
                  {cinema}
                </Button>
              ))}
            </Box>

            <Typography variant="h6" gutterBottom>
              Select Date
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
              {availableDates.length > 0 ? (
                availableDates.map((date) => (
                  <Button
                    key={date}
                    variant={selectedDate === date ? 'contained' : 'outlined'}
                    onClick={() => {
                      setSelectedDate(date);
                      setSelectedTimeSlot('');
                    }}
                    sx={{ minWidth: 100, flexGrow: 1 }}
                    aria-pressed={selectedDate === date}
                  >
                    {formatDate(date)}
                  </Button>
                ))
              ) : (
                <Typography color="text.secondary">
                  Please select a cinema to see available dates.
                </Typography>
              )}
            </Box>

            <Typography variant="h6" gutterBottom>
              Select Time Slot
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
              {availableTimeSlots.length > 0 ? (
                availableTimeSlots.map((timeSlot) => (
                  <Button
                    key={timeSlot}
                    variant={selectedTimeSlot === timeSlot ? 'contained' : 'outlined'}
                    onClick={() => setSelectedTimeSlot(timeSlot)}
                    sx={{ minWidth: 100, flexGrow: 1 }}
                    aria-pressed={selectedTimeSlot === timeSlot}
                  >
                    {formatTime(timeSlot)}
                  </Button>
                ))
              ) : (
                <Typography color="text.secondary">
                  Please select a date to see time slots.
                </Typography>
              )}
            </Box>

            <Typography variant="h6" gutterBottom>
              Select Language
            </Typography>
            <ToggleButtonGroup
              value={selectedLanguage}
              exclusive
              onChange={(e, lang) => setSelectedLanguage(lang)}
              fullWidth
              sx={{ mb: 3 }}
            >
              <ToggleButton value={movieDetails.language}>{movieDetails.language}</ToggleButton>
              <ToggleButton value="Hindi Dubbed">Hindi Dubbed</ToggleButton>
            </ToggleButtonGroup>

            <Typography variant="body2" color="error" mt={2}>
              Tickets are required for all admissions. No entry for children under 2.5 feet.
            </Typography>

            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              disabled={!isStep1Valid}
              onClick={handleNext}
              fullWidth
            >
              Next
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <Typography variant="h6" gutterBottom>
              Select Your Seats
            </Typography>
            <Box mt={2}>
              <Typography>Seat selection coming soon...</Typography>
            </Box>
            <Box mt={3} display="flex" justifyContent="space-between">
              <Button variant="outlined" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button variant="contained" color="success">
                Confirm Booking
              </Button>
            </Box>
          </>
        )} */}
            </Box>
        </LocalizationProvider>
    );
};

export default BookingForm;

