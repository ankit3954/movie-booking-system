import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Checkbox,
    FormControlLabel,
    Button,
    Typography,
    Divider,
    Stack,
    Box
} from '@mui/material';

import React, { useEffect, useState } from 'react';
import { BookingState, MovieDetail } from '../../types/movie.type';
import { formatDate, formatTime } from './BookingStep1';
import { useApi } from '../../hooks/useApi';
import { BookedSeat } from './BookingStep2';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

type BookingDialogProps = {
    isModalOpen: boolean;
    agreed: boolean;
    handleBookingDialog: (value: boolean) => void;
    handleAgreement: (value: boolean) => void;
    bookingState: BookingState;
    selectedSeats: BookedSeat[];
    movieDetails: MovieDetail;
    movieSchedule: string;
};

const getSelectedSeatsNumber = (selectedSeats: BookedSeat[]) => {
    return selectedSeats.map(seat => seat.seat_number)
}

const getSelectedSeatsIds = (selectedSeats: BookedSeat[]) => {
    return selectedSeats.map(seat => seat.id)
}


const BookingDialog: React.FC<BookingDialogProps> = ({
    isModalOpen,
    agreed,
    handleAgreement,
    handleBookingDialog,
    bookingState,
    selectedSeats,
    movieSchedule,
    movieDetails
}) => {
    const pricePerSeat = 200;
    const totalPrice = selectedSeats.length * pricePerSeat;
    const { post } = useApi();
    const { user } = useAuth()
    const navigate = useNavigate()
    const selectedSeatNumbers = getSelectedSeatsNumber(selectedSeats)
    const selectedSeatIds = getSelectedSeatsIds(selectedSeats)

    const handleConfirmBooking = async () => {
        try {
            // if (!user) {
            //     saveRedirectDetails(bookingState, movieSchedule, totalPrice, selectedSeatIds, movieDetails.movieId)
            //     alert("Login to proceed")
            //     navigate("/login")
            //     return
            // }

            const saveBookingDetails = await post<any>("http://localhost:5000/movies/bookseats", {
                userId: user?.id,
                movieScheduleId: movieSchedule,
                totalAmount: totalPrice,
                status: "booked",
                seatIds: selectedSeatIds
            })

            alert(saveBookingDetails.message)
        } catch (error) {
            console.log(error)
        }

        handleBookingDialog(false)
    };

    return (
        <Dialog open={isModalOpen} onClose={() => handleBookingDialog(false)} fullWidth maxWidth="sm">
            <DialogTitle textAlign="center" sx={{ fontWeight: 'bold' }}>
                🎟️ Confirm Your Booking
            </DialogTitle>

            <DialogContent dividers>
                <Stack spacing={2}>
                    <Typography variant="body1"><strong>Movie:</strong> {movieDetails.title}</Typography>
                    <Typography variant="body1"><strong>Theater:</strong> {bookingState.selectedCinema}</Typography>
                    <Typography variant="body1"><strong>Date:</strong> {formatDate(bookingState.selectedDate)}</Typography>
                    <Typography variant="body1"><strong>Time:</strong> {formatTime(bookingState.selectedTimeSlot)}</Typography>
                    <Typography variant="body1"><strong>Seats:</strong> {selectedSeatNumbers.join(', ')}</Typography>

                    <Divider sx={{ my: 1 }} />

                    <Box
                        bgcolor="#f5f5f5"
                        p={2}
                        borderRadius={2}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Box>
                            <Typography variant="body2">Price per seat</Typography>
                            <Typography variant="body2">Total seats</Typography>
                            <Typography variant="h6" mt={1}>Total Amount</Typography>
                        </Box>
                        <Box textAlign="right">
                            <Typography variant="body2">₹{pricePerSeat}</Typography>
                            <Typography variant="body2">{selectedSeats.length}</Typography>
                            <Typography variant="h6" mt={1}>₹{totalPrice}</Typography>
                        </Box>
                    </Box>

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={agreed}
                                onChange={(e) => handleAgreement(e.target.checked)}
                            />
                        }
                        label="I accept the Terms and Conditions"
                    />
                </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={() => handleBookingDialog(false)} variant="outlined">
                    Cancel
                </Button>
                <Button
                    onClick={handleConfirmBooking}
                    disabled={!agreed}
                    variant="contained"
                    color="primary"
                >
                    Confirm Booking
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default BookingDialog;


