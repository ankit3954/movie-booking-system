// src/components/common/Layout/MainLayout/MainLayout.tsx
import { Outlet } from 'react-router-dom'
import { Box, Container } from '@mui/material'
// import { Header } from '@/components/common/Layout/Header'
// import { Footer } from '@/components/common/Layout/Footer'

export const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {/* <Header /> */}
      {/* <Container component="main" > */}
        <Outlet />
      {/* </Container> */}
      {/* <Footer /> */}
    </Box>
  )
}