import { createBrowserRouter } from "react-router-dom"
import { MainLayout } from "./components/common/Layout/MainLayout/MainLayout"
import Login from "./pages/Auth/Login/Login"
import AuthSuccess from "./pages/Auth/Login/AuthSuccess"
import Register from "./pages/Auth/Register/Register"
import Home from "./pages/Home/Home"
import MovieBooking from "./pages/Movies/MovieBooking/MovieBooking"
import PaymentSuccess from "./pages/Payments/PaymentSuccess"
import PaymentFailed from "./pages/Payments/PaymentFailed"

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/register',
                element: <Register />
            },
            {
                path: '/auth/success',
                element: <AuthSuccess />
            },
            {
                path: '/movie/booking/:movieId',
                element: <MovieBooking />
            },
            {
                path: '/payment/success',
                element: <PaymentSuccess />
            },
            {
                path: '/payment/cancel',
                element: <PaymentFailed />
            }
        ]
    }
])