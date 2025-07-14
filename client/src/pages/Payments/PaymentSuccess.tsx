import React, { useEffect, useState } from "react";
import { Button, Container, Typography, Box } from "@mui/material";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useApi } from "../../hooks/useApi";

const PaymentSuccess: React.FC = () => {
    const [searchParams] = useSearchParams();
    const { get } = useApi()
    const bookingId = searchParams.get("bookingId");
    const navigate = useNavigate()
    const [status, setStatus] = useState<"loading" | "paid" | "pending">("loading");

    useEffect(() => {

        const fetchBookingStatus = async () => {
            if (bookingId) {
                const res = await get<any>(`http://localhost:5000/payment/booking-status/?bookingId=${bookingId}`)
                if (res.data.status === "booked") {
                    setStatus("paid");
                } else {
                    setStatus("pending");
                }
            }else{
                navigate("/")
            }
        }

        fetchBookingStatus()
    }, [bookingId]);

    return (
        <Container maxWidth="sm">
            <Box textAlign="center" mt={10}>
                <Typography variant="h4" color="success.main" gutterBottom>
                    {
                        status === 'paid' ? "Payment Successfull" : "Invalid or Expired Payment"
                    }
                </Typography>
                {status === "paid" &&
                    <Typography variant="subtitle1" gutterBottom>
                        Your booking has been confirmed.
                    </Typography>
                }
                <Button
                    component={Link}
                    to="/"
                    variant="contained"
                    color="success"
                    sx={{ mt: 3 }}
                >
                    Go Back to Home
                </Button>
            </Box>
        </Container>
    );
};

export default PaymentSuccess;
