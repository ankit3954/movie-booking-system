// src/components/common/Layout/MainLayout/MainLayout.tsx
import { Outlet, useLocation } from 'react-router-dom'
import { Box, Container } from '@mui/material'
import Header from '../../../ui/Header'
// import { Header } from '@/components/common/Layout/Header'
// import { Footer } from '@/components/common/Layout/Footer'

export const MainLayout = () => {

  const location = useLocation();

  // Define routes where header should be hidden
  const hideHeaderOnRoutes = ['/login', '/register'];

  const shouldHideHeader = hideHeaderOnRoutes.includes(location.pathname);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {/* <Header /> */}
      {/* <Container component="main" > */}
      {!shouldHideHeader && <Header/>}
        <Outlet />
      {/* </Container> */}
      {/* <Footer /> */}
    </Box>
  )
}