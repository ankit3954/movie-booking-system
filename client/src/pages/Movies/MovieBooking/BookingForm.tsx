import React, { useState, useMemo } from 'react';
import {
    Box,
    Typography,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { BookingFormProps, BookingState } from '../../../types/movie.type';
import BookingStep1 from '../../../components/ui/BookingStep1';
import BookingStep2 from '../../../components/ui/BookingStep2';



const getUnique = (arr: string[]) => Array.from(new Set(arr));

const BookingForm: React.FC<BookingFormProps> = ({ movieDetails }) => {
    const [step, setStep] = useState(1);
    const [bookingState, setBookingState] = useState<BookingState>({
        selectedCinema: '',
        selectedDate: '',
        selectedTimeSlot: '',
        selectedLanguage: '',
    });

    console.log("Booking State", bookingState)
    const cinemas = useMemo(() => Object.keys(movieDetails.schedules || {}), [movieDetails]);

    const availableDates = useMemo(() => {
        if (!bookingState.selectedCinema) return [];
        const entries = movieDetails.schedules[bookingState.selectedCinema] || [];
        return getUnique(entries.map((e) => e.showTime));
    }, [bookingState.selectedCinema, movieDetails]);

    const availableTimeSlots = useMemo(() => {
        if (!bookingState.selectedCinema || !bookingState.selectedDate) return [];
        const entries = movieDetails.schedules[bookingState.selectedCinema] || [];
        return getUnique(
            entries
                .filter((e) => e.showTime === bookingState.selectedDate)
                .map((e) => e.startTime)
        );
    }, [bookingState.selectedCinema, bookingState.selectedDate, movieDetails]);

    const schedulesForTheater = useMemo(() => {
        const entries = movieDetails.schedules[bookingState.selectedCinema];
        if (!entries) return [];

        return entries
            .filter(entry => entry.showTime === bookingState.selectedDate)  // compare with selected date
            .map(entry => ({
                movieSchedule: entry.movieSchedule,
                theaterId: entry.theaterId
            }));
    }, [bookingState.selectedCinema, bookingState.selectedDate])

    const isStep1Valid = bookingState.selectedCinema && bookingState.selectedDate && bookingState.selectedTimeSlot && bookingState.selectedLanguage;

    const handleNext = () => {
        if (isStep1Valid) setStep(2);
    };

    const handleBack = (step: number) => {
        setStep(step)
    }

    const updateBookingState = <K extends keyof BookingState>(key: K, value: BookingState[K]) => {
        setBookingState((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleBookingState = (bookingState:BookingState ) => {
        setBookingState(bookingState)
    }

    const resetDependentFields = () => {
        updateBookingState('selectedDate', '')
        updateBookingState('selectedTimeSlot', '')
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
                        bookingState={bookingState}
                        isStep1Valid={isStep1Valid}
                        updateBookingState={updateBookingState}
                        handleNext={handleNext}
                        resetDependentFields={resetDependentFields}
                    />
                }
                {step === 2 && <BookingStep2 
                                    handleBack={handleBack} 
                                    schedulesForTheater = {schedulesForTheater}
                                    bookingState={bookingState}
                                    movieDetails={movieDetails}
                                    handleBookingState= {handleBookingState}
                                />}
            </Box>
        </LocalizationProvider>
    );
};

export default BookingForm;

