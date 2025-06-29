import { Box, Button, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useApi } from '../../hooks/useApi';


type ScheduleDetails = {
    movieSchedule: string;
    theaterId: string;
}
type BookingStep2Props = {
    handleBack: (step: number) => void;
    schedulesForTheater: ScheduleDetails[]
}

type Seat = {
    // seat_id: number;
    seat_number: string;
    seat_type: string;
    is_booked?: boolean;
};

type BookedSeat = {
    seat_number: string;
};

const BookingStep2: React.FC<BookingStep2Props> = ({
    handleBack,
    schedulesForTheater
}) => {

    const [seats, setSeats] = useState<(Seat)[]>([]);
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const { get } = useApi();

    const { theaterId, movieSchedule } = schedulesForTheater[0]

    const getBookedSeatNumbers = (bookedSeatDetails: BookedSeat[]) => bookedSeatDetails.map(seat => seat.seat_number);


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
                    is_booked: bookedSeatNumbers.includes(seat.seat_number),
                }));

                setSeats(mergedSeats);
            } catch (err) {
                console.error("Error loading seat data:", err);
            }
        };

        fetchSeatLayoutWithBooking();
    }, [theaterId, movieSchedule]);


    const toggleSeat = (seatNumber: string) => {
        setSelectedSeats(prev =>
            prev.includes(seatNumber)
                ? prev.filter(number => number !== seatNumber) // remove if already selected
                : [...prev, seatNumber]                // add if not selected
        );
    };

    return (
        <Box>
            <Typography align="center" mb={2}>🎬 Screen</Typography>
            {Array.from(new Set(seats.map(s => s.seat_number[0]))).map(row => (
                <Box key={row} display="flex" alignItems="center" mb={1}>
                    {/* Uncomment this if you want row labels like A, B, C */}
                    {/* <Typography width={20}>{row}</Typography> */}

                    <Box display="flex" gap={0.5}>
                        {seats
                            .filter(seat => seat.seat_number.startsWith(row))
                            .map(seat => (
                                <Button
                                    key={seat.seat_number}
                                    variant={
                                        seat.is_booked
                                            ? 'contained'
                                            : selectedSeats.includes(seat.seat_number)
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
        </Box>


    )
}

export default BookingStep2