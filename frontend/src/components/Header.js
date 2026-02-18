import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PsychologyIcon from '@mui/icons-material/Psychology';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Predict Career', path: '/predict' },
  { name: 'About', path: '/about' }
];

function Header() {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);

  const handleOpenMobileMenu = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleCloseMobileMenu = () => {
    setMobileMenuAnchor(null);
  };

  return (
    <AppBar position="static" elevation={0} sx={{ backgroundColor: 'white', color: 'primary.main' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <PsychologyIcon sx={{ mr: 1, fontSize: 36 }} />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
              flexGrow: 1
            }}
          >
            CAREER PREDICTOR
          </Typography>

          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                aria-label="menu"
                edge="end"
                onClick={handleOpenMobileMenu}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={mobileMenuAnchor}
                open={Boolean(mobileMenuAnchor)}
                onClose={handleCloseMobileMenu}
              >
                {navItems.map((item) => (
                  <MenuItem 
                    key={item.name}
                    component={RouterLink}
                    to={item.path}
                    onClick={handleCloseMobileMenu}
                    selected={location.pathname === item.path}
                  >
                    {item.name}
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex' }}>
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  component={RouterLink}
                  to={item.path}
                  sx={{ 
                    mx: 1,
                    color: location.pathname === item.path ? 'primary.dark' : 'primary.main',
                    fontWeight: location.pathname === item.path ? 700 : 500,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      width: location.pathname === item.path ? '100%' : '0%',
                      height: '3px',
                      bottom: 0,
                      left: 0,
                      backgroundColor: 'primary.main',
                      transition: '0.3s'
                    },
                    '&:hover::after': {
                      width: '100%'
                    }
                  }}
                >
                  {item.name}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header; 