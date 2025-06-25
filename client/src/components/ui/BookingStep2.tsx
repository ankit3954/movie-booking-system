import { Box, Button, Typography } from '@mui/material'
import React from 'react'


type BookingStep2Props = {
    handleBack: (step: number) => void
}

const BookingStep2:React.FC<BookingStep2Props> = ({
    handleBack
}) => {
    return (
        <>
            <Typography variant="h6" gutterBottom>
                Select Your Seats
            </Typography>
            <Box mt={2}>
                <Typography>Seat selection coming soon...</Typography>
            </Box>
            <Box mt={3} display="flex" justifyContent="space-between">
                <Button variant="outlined" onClick={() => handleBack(1)}>
                    Back
                </Button>
                <Button variant="contained" color="success">
                    Confirm Booking
                </Button>
            </Box>
        </>
    )
}

export default BookingStep2