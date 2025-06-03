import {createBrowserRouter} from "react-router-dom"
import { MainLayout } from "./components/common/Layout/MainLayout/MainLayout"
import Login from "./pages/Auth/Login/Login"

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout/>,
        children:[
            // {
            //     index: true,
            //     element: <Home />
            // },
            {
                path: '/login',
                element: <Login />
            },
            {
                path: 'Register',
                element: <p>Register</p>
            }
        ]
    }
])