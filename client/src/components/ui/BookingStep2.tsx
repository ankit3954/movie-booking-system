import { Box, Button, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useApi } from '../../hooks/useApi';
import BookingDialog from './BookingDialog';
import { BookedSeat, BookingStep2Props, Seat } from '../../types/movie.type';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';


function saveRedirectDetails( movieId: string) {
    localStorage.setItem("bookingRedirectDetails", JSON.stringify({
        redirectTo: `/movie/booking/${movieId}`,
        // bookingData: {
        //     bookingState: bookingState,
        //     movieScheduleId,
        //     totalPrice,
        //     selectedSeatIds
        // }
    }))
}

const BookingStep2: React.FC<BookingStep2Props> = ({
    handleBack,
    schedulesForTheater,
    bookingState,
    movieDetails,
    handleBookingState
}) => {

    const [seats, setSeats] = useState<Seat[]>([]);
    const [selectedSeats, setSelectedSeats] = useState<BookedSeat[]>([]);
    const { get } = useApi();
    const {user} = useAuth()
    const navigate = useNavigate()
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [agreed, setAgreed] = useState<boolean>(false);

    const { theaterId, movieSchedule } = schedulesForTheater[0]
    // const [movieScheduleId, setMovieScheduleId] = useState(movieSchedule)
    // const [bookingDetails, setBookingDetails] = useState(bookingState)

    const getBookedSeatNumbers = (bookedSeatDetails: BookedSeat[]) => bookedSeatDetails.map(seat => seat.id);

    // const location = useLocation();
    // const bookingData = location.state;

    //working on retaining state for redirect 

    // useEffect(() => {
    //     console.log("Booking Data",bookingData)
    //     if (bookingData && bookingData.selectedSeats && bookingData.bookingState && bookingData.movieScheduleId) {
    //         console.log("I am here")
    //         setSelectedSeats(bookingData.selectedSeats);
    //         setBookingDetails(bookingData.bookingState);
    //         setModalOpen(true); // Reopen the booking modal
    //         setMovieScheduleId(bookingData.movieScheduleId)
    //     }
    // }, [bookingData]);

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
        try {
             if (!user) {
                saveRedirectDetails(movieDetails.movieId)
                alert("Login to proceed")
                navigate("/login")
                return
            }else{
                setModalOpen(value)
            }
        } catch (error) {
            console.log(error)
        }
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
                movieDetails={movieDetails}
            />
        </Box>


    )
}

export default BookingStep2