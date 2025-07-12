import React from 'react';
import { AppBar, Toolbar, Typography, Button, InputBase } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  pointerEvents: 'none',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  paddingLeft: `calc(1em + ${theme.spacing(4)})`,
  width: '100%',
  [theme.breakpoints.up('md')]: {
    width: '20ch',
  },
}));

const Header: React.FC = () => {
  const navigate = useNavigate();

  const { logout, token} = useAuth()

  const handleSignInAndSignOut = () => {
    if(token){
        logout()
    }
    else
        navigate("/login")
  }

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1c1c1c' }}>
      <Toolbar>
        {/* Logo */}
        <Typography
          variant="h6"
          sx={{ cursor: 'pointer', flexGrow: 1 }}
          onClick={() => navigate('/')}
        >
          🎬 MovieBooking
        </Typography>

        {/* Search */}
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} />
        </Search>

        {/* Sign In */}
        <Button color="inherit" onClick={handleSignInAndSignOut}>
          {token ? "Sign Out" : "Sign In"}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
