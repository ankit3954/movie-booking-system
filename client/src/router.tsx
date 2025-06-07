import {createBrowserRouter} from "react-router-dom"
import { MainLayout } from "./components/common/Layout/MainLayout/MainLayout"
import Login from "./pages/Auth/Login/Login"
import AuthSuccess from "./pages/Auth/Login/AuthSuccess"
import Register from "./pages/Auth/Register/Register"

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout/>,
        children:[
            {
                path: '/dashboard',
                element: <p>Dashboard</p>
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
            }
        ]
    }
])