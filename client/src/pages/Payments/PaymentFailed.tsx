import React, { useEffect } from "react";
import { Button, Container, Typography, Box } from "@mui/material";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const PaymentFailed: React.FC = () => {

    const [searchParams] = useSearchParams();
    const bookingId = searchParams.get("bookingId");
    const navigate = useNavigate()

    useEffect(() => {
        if (!bookingId) {
            navigate("/")
        }
    }, []);

    return (
        <Container maxWidth="sm">
            <Box textAlign="center" mt={10}>
                <Typography variant="h4" color="error.main" gutterBottom>
                    Payment Failed!
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    There was an issue processing your payment.
                </Typography>
                <Button
                    component={Link}
                    to="/"
                    variant="contained"
                    color="error"
                    sx={{ mt: 3 }}
                >
                    Try Again
                </Button>
            </Box>
        </Container>
    );
};

export default PaymentFailed;
