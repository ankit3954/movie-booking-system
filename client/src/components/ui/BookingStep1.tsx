import React, { useState, useMemo } from 'react';
import {
    Box,
    Typography,
    Button,
    ToggleButtonGroup,
    ToggleButton,
} from '@mui/material';
import { MovieDetail } from '../../types/movie.type';

type BookingStep1Props = {
    movieDetails: MovieDetail;
    cinemas: string[];
    availableDates: string[];
    availableTimeSlots: string[];
    selectedCinema: string;
    selectedDate: string;
    selectedTimeSlot: string;
    selectedLanguage: string;
    isStep1Valid: string;
    handleSelectedCinema: (cinema: string) => void;
    handleSelectedDate: (date: string) => void;
    handleSelectedTimeSlot: (timeSlot: string) => void;
    handleSelectedLanguage: (language: string) => void
    handleNext: () => void;
    resetDependentFields: () => void;
}

const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
    });

const formatTime = (timeStr: string) =>
    new Date(`1970-01-01T${timeStr}`).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });

const BookingStep1: React.FC<BookingStep1Props> = ({
    movieDetails,
    cinemas,
    availableDates,
    availableTimeSlots,
    selectedCinema,
    selectedDate,
    selectedTimeSlot,
    selectedLanguage,
    isStep1Valid,
    handleSelectedCinema,
    handleSelectedDate,
    handleSelectedTimeSlot,
    handleSelectedLanguage,
    handleNext,
    resetDependentFields
}) => {

    return (
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
                            handleSelectedCinema(cinema);
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
                                handleSelectedDate(date);
                                handleSelectedTimeSlot('');
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
                            onClick={() => handleSelectedTimeSlot(timeSlot)}
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
                onChange={(e, lang) => handleSelectedLanguage(lang)}
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
    )

}

export default BookingStep1