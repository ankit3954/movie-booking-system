import React, { useState, ChangeEvent, FormEvent, JSX} from "react";
import {
    Box,
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Link,
    Alert,
    IconButton,
    InputAdornment
} from "@mui/material";
import { Visibility, VisibilityOff, Movie } from "@mui/icons-material";
import { useAuth } from "../../../hooks/useAuth";
import { RegisterForm } from "../../../types/movie.type";



const Register = (): JSX.Element => {
    const { register, loading } = useAuth();
    const [formData, setFormData] = useState<RegisterForm>({
        username: "",
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value, checked, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setError("");

        const { username, email, password } = formData;
        const success = await register(username, email, password);

        if (success) {
            setFormData({ email: "", password: "", username: "" });
        } else {
            setError("Invalid email or password. Please try again.");
        }
    };

    const togglePasswordVisibility = (): void => {
        setShowPassword((prev) => !prev);
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 2,
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={10}
                    sx={{
                        padding: 4,
                        borderRadius: 3,
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(10px)",
                    }}
                >
                    <Box sx={{ textAlign: "center", mb: 4 }}>
                        <Box
                            sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 64,
                                height: 64,
                                borderRadius: "50%",
                                backgroundColor: "primary.main",
                                mb: 2,
                            }}
                        >
                            <Movie sx={{ fontSize: 32, color: "white" }} />
                        </Box>
                        <Typography
                            variant="h4"
                            component="h1"
                            fontWeight="bold"
                            gutterBottom
                        >
                            Welcome
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Register to continue to MovieBooker
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Username"
                            name="username"
                            type="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                            sx={{ mb: 3 }}
                            variant="outlined"
                        />

                        <TextField
                            fullWidth
                            label="Email Address"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            sx={{ mb: 3 }}
                            variant="outlined"
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            sx={{ mb: 2 }}
                            variant="outlined"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={togglePasswordVisibility}
                                            edge="end"
                                            aria-label="toggle password visibility"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 3,
                            }}
                        >
                            {/* <FormControlLabel
                control={
                  <Checkbox
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    color="primary"
                  />
                }
                label="Remember me"
              /> */}
                            {/* <Link
                href="#"
                variant="body2"
                sx={{
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Forgot password?
              </Link> */}
                        </Box>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={loading}
                            sx={{
                                mb: 3,
                                py: 1.5,
                                fontSize: "1.1rem",
                                fontWeight: "bold",
                                borderRadius: 2,
                                textTransform: "none",
                            }}
                        >
                            {loading ? "Creating..." : "Create Account"}
                        </Button>

                        <Box sx={{ textAlign: "center" }}>
                            <Typography variant="body2" color="text.secondary">
                                Already have an account?{" "}
                                <Link
                                    href="/login"
                                    sx={{
                                        color: "primary.main",
                                        textDecoration: "none",
                                        fontWeight: "bold",
                                        "&:hover": { textDecoration: "underline" },
                                    }}
                                >
                                    Sign in here
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>

                <Box sx={{ textAlign: "center", mt: 3 }}>
                    <Typography
                        variant="body2"
                        sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                    >
                        By signing up, you agree to our{" "}
                        <Link href="#" sx={{ color: "rgba(255, 255, 255, 0.9)" }}>
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="#" sx={{ color: "rgba(255, 255, 255, 0.9)" }}>
                            Privacy Policy
                        </Link>
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}


export default Register;