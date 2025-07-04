import { Box, Button, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useApi } from '../../hooks/useApi';
import BookingDialog from './BookingDialog';
import { BookingState } from '../../types/movie.type';


type ScheduleDetails = {
    movieSchedule: string;
    theaterId: string;
}
type BookingStep2Props = {
    handleBack: (step: number) => void;
    schedulesForTheater: ScheduleDetails[];
    bookingState: BookingState;
    title: string;
}

type Seat = {
    id: string;
    seat_number: string;
    seat_type: string;
    is_booked?: boolean;
};

export type BookedSeat = {
    seat_number: string;
    id: string;
};

const BookingStep2: React.FC<BookingStep2Props> = ({
    handleBack,
    schedulesForTheater,
    bookingState,
    title
}) => {

    const [seats, setSeats] = useState<Seat[]>([]);
    const [selectedSeats, setSelectedSeats] = useState<BookedSeat[]>([]);
    const { get } = useApi();
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [agreed, setAgreed] = useState<boolean>(false);

    const { theaterId, movieSchedule } = schedulesForTheater[0]

    const getBookedSeatNumbers = (bookedSeatDetails: BookedSeat[]) => bookedSeatDetails.map(seat => seat.id);


    useEffect(() => {
        const fetchSeatLayoutWithBooking = async () => {
            try {
                // 1. Get all seats for the theater
                const seatRes = await get<any>(`http://localhost:5000/movies/getSeats?theaterId=${theaterId}`);
                const allSeats: Seat[] = seatRes.data;

                // 2. Get booked seat IDs for this show
                const bookedRes = await get<any>(`http://localhost:5000/movies/getBookedSeats?movieScheduleId=${movieSchedule}`);
                const bookedSeatDetails: BookedSeat[] = bookedRes.data;
                const bookedSeatNumbers = getBookedSeatNumbers(bookedSeatDetails)

                // 3. Combine both
                const mergedSeats = allSeats.map(seat => ({
                    ...seat,
                    is_booked: bookedSeatNumbers.includes(seat.id),
                }));

                setSeats(mergedSeats);
            } catch (err) {
                console.error("Error loading seat data:", err);
            }
        };

        fetchSeatLayoutWithBooking();
    }, [theaterId, movieSchedule]);


    const toggleSeat = (seatNumber: string) => {
        setSelectedSeats(prev => {
            const isSelected = prev.some(seat => seat.seat_number === seatNumber);

            if (isSelected) {
                return prev.filter(seat => seat.seat_number !== seatNumber); // remove
            } else {
                const seatToAdd = seats.find(seat => seat.seat_number === seatNumber);
                return seatToAdd ? [...prev, seatToAdd] : prev;
            }
        });
    };


    const handleBookingDialog = (value: boolean) => {
        setModalOpen(value)
    }


    const handleAgreement = (value: boolean) => {
        setAgreed(value)
    }

    return (
        <Box display="flex" flexDirection="column" alignItems="center">
            <Typography align="center" mb={2}>🎬 Screen</Typography>
            {Array.from(new Set(seats.map(s => s.seat_number[0]))).map(row => (
                <Box key={row} display="flex" alignItems="center" mb={1}>
                    <Box display="flex" gap={0.5}>
                        {seats
                            .filter(seat => seat.seat_number.startsWith(row))
                            .map(seat => (
                                <Button
                                    key={seat.id}
                                    variant={
                                        seat.is_booked
                                            ? 'contained'
                                            : selectedSeats.some((s) => s.seat_number === seat.seat_number)
                                                ? 'outlined'
                                                : 'text'
                                    }
                                    disabled={seat.is_booked}
                                    onClick={() => toggleSeat(seat.seat_number)}
                                >
                                    {seat.seat_number}
                                </Button>
                            ))}
                    </Box>
                </Box>
            ))}
            <Box mt={3} display="flex" gap={5}>
                <Button variant="outlined" onClick={() => handleBack(1)}>
                    Back
                </Button>
                <Button variant="contained" color="success" onClick={() => handleBookingDialog(true)}>
                    Buy Now
                </Button>
            </Box>

            <BookingDialog
                isModalOpen={isModalOpen}
                agreed={agreed}
                handleBookingDialog={handleBookingDialog}
                handleAgreement={handleAgreement}
                bookingState={bookingState}
                selectedSeats={selectedSeats}
                movieSchedule={movieSchedule}
                title={title}
            />


        </Box>


    )
}

export default BookingStep2