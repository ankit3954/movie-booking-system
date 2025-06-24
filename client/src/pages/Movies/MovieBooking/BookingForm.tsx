// // import React from 'react'

// // const BookingForm = () => {
// //   return (
// //     <div>BookingForm</div>
// //   )
// // }

// // export default BookingForm

// import React, { useState } from 'react';
// import {
//     Box,
//     Typography,
//     TextField,
//     Select,
//     MenuItem,
//     FormControl,
//     InputLabel,
//     Button,
//     ToggleButtonGroup,
//     ToggleButton
// } from '@mui/material';
// import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// const BookingForm = () => {
//     const [step, setStep] = useState(1);

//     // Step 1 fields
//     const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
//     const [selectedCinema, setSelectedCinema] = useState('');
//     const [selectedLanguage, setSelectedLanguage] = useState('');
//     const [selectedTime, setSelectedTime] = useState('');

//     const isStep1Valid =
//         selectedDate && selectedCinema && selectedLanguage && selectedTime;

//     const handleNext = () => {
//         if (isStep1Valid) {
//             setStep(2);
//         }
//     };

//     return (
//         <LocalizationProvider dateAdapter={AdapterDateFns}>
//             <Box p={3}>
//                 {step === 1 && (
//                     <>
//                         <Typography variant="h6" gutterBottom>
//                             Step 1: Select Date, Cinema, Language & Time
//                         </Typography>

//                         <Box
//                             display="grid"
//                             gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }}
//                             gap={2}
//                         >
//                             {/* Date Picker */}
//                             <DatePicker
//                                 label="Select Date"
//                                 value={selectedDate}
//                                 onChange={(newDate) => setSelectedDate(newDate)}
//                                 enableAccessibleFieldDOMStructure={false}
//                                 slots={{ textField: TextField }}
//                                 slotProps={{
//                                     textField: {
//                                         fullWidth: true,
//                                     },
//                                 }}
//                             />

//                             {/* Cinema Selector */}
//                             <FormControl fullWidth>
//                                 <InputLabel>Select Cinema</InputLabel>
//                                 <Select
//                                     value={selectedCinema}
//                                     onChange={(e) => setSelectedCinema(e.target.value)}
//                                     label="Select Cinema"
//                                 >
//                                     <MenuItem value="Skyline Mall">Skyline Mall</MenuItem>
//                                     <MenuItem value="City Center">City Center</MenuItem>
//                                 </Select>
//                             </FormControl>

//                             {/* Language Selector */}
//                             <ToggleButtonGroup
//                                 value={selectedLanguage}
//                                 exclusive
//                                 onChange={(e, lang) => setSelectedLanguage(lang)}
//                                 fullWidth
//                             >
//                                 <ToggleButton value="All">All</ToggleButton>
//                                 <ToggleButton value="Hindi Dubbed">Hindi Dubbed</ToggleButton>
//                             </ToggleButtonGroup>

//                             {/* Time Slot Selector */}
//                             <FormControl fullWidth>
//                                 <InputLabel>Select Time</InputLabel>
//                                 <Select
//                                     value={selectedTime}
//                                     onChange={(e) => setSelectedTime(e.target.value)}
//                                     label="Select Time"
//                                 >
//                                     <MenuItem value="10:00 AM">10:00 AM</MenuItem>
//                                     <MenuItem value="1:00 PM">1:00 PM</MenuItem>
//                                     <MenuItem value="4:00 PM">4:00 PM</MenuItem>
//                                 </Select>
//                             </FormControl>
//                         </Box>

//                         <Typography variant="body2" color="error" mt={2}>
//                             Tickets are required for all admissions. No entry for children under 2.5 feet.
//                         </Typography>

//                         <Button
//                             variant="contained"
//                             color="primary"
//                             sx={{ mt: 3 }}
//                             disabled={!isStep1Valid}
//                             onClick={handleNext}
//                             fullWidth
//                         >
//                             Next
//                         </Button>
//                     </>
//                 )}

//                 {step === 2 && (
//                     <>
//                         <Typography variant="h6" gutterBottom>
//                             Step 2: Select Your Seats
//                         </Typography>

//                         <Box mt={2}>
//                             <Typography>Seat selection coming soon...</Typography>
//                             {/* You can add grid of seat buttons here */}
//                         </Box>

//                         <Box mt={3} display="flex" justifyContent="space-between">
//                             <Button variant="outlined" onClick={() => setStep(1)}>
//                                 Back
//                             </Button>
//                             <Button variant="contained" color="success">
//                                 Confirm Booking
//                             </Button>
//                         </Box>
//                     </>
//                 )}
//             </Box>
//         </LocalizationProvider>
//     );
// };

// export default BookingForm;

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    ToggleButtonGroup,
    ToggleButton,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { MovieDetail } from '../../../types/movie.type';

type BookingFormProps = {
    movieDetails: MovieDetail
};


const BookingForm: React.FC<BookingFormProps> = ({ movieDetails }) => {
    const [step, setStep] = useState(1);
    const [selectedCinema, setSelectedCinema] = useState<string>('');
    const [availableDates, setAvailableDates] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
    const [selectedLanguage, setSelectedLanguage] = useState('');

    const cinemas = Object.keys(movieDetails.schedules)
    console.log(cinemas)

    const getAvailableDates = (selectedCinema: string) => {
        const entries = movieDetails.schedules[selectedCinema];
        if (!entries) return [];

        return entries.map(entry => entry.showTime);
    }

    const getAvailableTimeSlots = (selectedCinema: string, selectedDate: string) => {
        const entries = movieDetails.schedules[selectedCinema];
        if (!entries) return [];

        return entries
            .filter(entry => entry.showTime === selectedDate)
            .map(entry => entry.startTime);
    }
    // Update available dates when cinema changes
    useEffect(() => {
        if (selectedCinema) {
            const dates = getAvailableDates(selectedCinema)
            setAvailableDates(dates);
            setSelectedDate(''); // reset date on cinema change
        } else {
            setAvailableDates([]);
            setSelectedDate('');
        }
    }, [selectedCinema]);


    useEffect(() => {
        if (selectedDate) {
            const timeSlots = getAvailableTimeSlots(selectedCinema, selectedDate)
            setAvailableTimeSlots(timeSlots)
            setSelectedTimeSlot('')
        } else {
            setAvailableTimeSlots([])
            setSelectedTimeSlot('')
        }
    }, [selectedDate])

    const isStep1Valid = selectedCinema && selectedDate && selectedLanguage;

    const handleNext = () => {
        if (isStep1Valid) setStep(2);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box p={3}>
                {step === 1 && (
                    <>
                        <Typography variant="h6" gutterBottom>
                            Step 1: Select Cinema
                        </Typography>

                        {/* Cinema selection boxes */}
                        <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
                            {cinemas.map((cinema) => (
                                <Button
                                    key={cinema}
                                    variant={selectedCinema === cinema ? 'contained' : 'outlined'}
                                    onClick={() => setSelectedCinema(cinema)}
                                    sx={{ minWidth: 120, flexGrow: 1 }}
                                >
                                    {cinema}
                                </Button>
                            ))}
                        </Box>

                        <Typography variant="h6" gutterBottom>
                            Select Date
                        </Typography>

                        {/* Date selection boxes */}
                        <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
                            {availableDates.length > 0 ? (
                                availableDates.map((date) => {
                                    const dateStr = date.toString();
                                    return (
                                        <Button
                                            key={dateStr}
                                            variant={
                                                selectedDate?.toString() === dateStr
                                                    ? 'contained'
                                                    : 'outlined'
                                            }
                                            onClick={() => setSelectedDate(date)}
                                            sx={{ minWidth: 100, flexGrow: 1 }}
                                        >
                                            {date}
                                        </Button>
                                    );
                                })
                            ) : (
                                <Typography color="text.secondary">
                                    Please select a cinema to see available dates.
                                </Typography>
                            )}
                        </Box>

                        <Typography variant="h6" gutterBottom>
                            Select Time Slot
                        </Typography>

                        {/* Date selection boxes */}
                        <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
                            {availableTimeSlots.length > 0 ? (
                                availableTimeSlots.map((timeSlot) => {
                                    const timeSlotStr = timeSlot.toString();
                                    return (
                                        <Button
                                            key={timeSlotStr}
                                            variant={
                                                selectedTimeSlot?.toString() === timeSlotStr
                                                    ? 'contained'
                                                    : 'outlined'
                                            }
                                            onClick={() => setSelectedTimeSlot(timeSlot)}
                                            sx={{ minWidth: 100, flexGrow: 1 }}
                                        >
                                            {timeSlot}
                                        </Button>
                                    );
                                })
                            ) : (
                                <Typography color="text.secondary">
                                    Please select a cinema to see available dates.
                                </Typography>
                            )}
                        </Box>

                        <Typography variant="h6" gutterBottom>
                            Select Language
                        </Typography>

                        {/* Language toggle buttons */}
                        <ToggleButtonGroup
                            value={selectedLanguage}
                            exclusive
                            onChange={(e, lang) => setSelectedLanguage(lang)}
                            fullWidth
                            sx={{ mb: 3 }}
                        >
                            <ToggleButton value="All">All</ToggleButton>
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
                            Step 2: Select Your Seats
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
                )}
            </Box>
        </LocalizationProvider>
    );
};

export default BookingForm;
